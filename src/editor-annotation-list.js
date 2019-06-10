// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**
 * By this file we are creating the Editor
 * It depends on parameters what kind of editor(Rich Text or Code editor would be created)
 *
 * @Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 *
 *
 */
(function (window) {
  const AnnotationList = (function () {
    const { Span } = window;

    function assert(bool, text) {
      if (!bool) {
        throw new Error(`AnnotationList assertion failed${text ? (`: ${text}`) : ''}`);
      }
    }

    function OldAnnotatedSpan(pos, node) {
      this.pos = pos;
      this.length = node.length;
      this.annotation = node.annotation;
      this.attachedObject_ = node.attachedObject;
    }

    OldAnnotatedSpan.prototype.getAttachedObject = function () {
      return this.attachedObject_;
    };

    function NewAnnotatedSpan(pos, node) {
      this.pos = pos;
      this.length = node.length;
      this.annotation = node.annotation;
      this.node_ = node;
    }

    NewAnnotatedSpan.prototype.attachObject = function (object) {
      this.node_.attachedObject = object;
    };

    const NullAnnotation = {
      equals() {
        return false;
      },
    };

    function AnnotationList(changeHandler) {
      // There's always a head node; to avoid special cases.
      this.head_ = new Node(0, NullAnnotation);
      this.changeHandler_ = changeHandler;
    }

    AnnotationList.prototype.insertAnnotatedSpan = function (span, annotation) {
      this.wrapOperation_(new Span(span.pos, 0), (oldPos, old) => {
        assert(!old || old.next === null); // should be 0 or 1 nodes.
        const toInsert = new Node(span.length, annotation);
        if (!old) {
          return toInsert;
        }
        assert(span.pos > oldPos && span.pos < oldPos + old.length);
        const newNodes = new Node(0, NullAnnotation);
        // Insert part of old before insertion point.
        newNodes.next = new Node(span.pos - oldPos, old.annotation);
        // Insert new node.
        newNodes.next.next = toInsert;
        // Insert part of old after insertion point.
        toInsert.next = new Node(oldPos + old.length - span.pos, old.annotation);
        return newNodes.next;
      });
    };

    AnnotationList.prototype.removeSpan = function (removeSpan) {
      if (removeSpan.length === 0) {
        return;
      }

      this.wrapOperation_(removeSpan, (oldPos, old) => {
        assert(old !== null);
        const newNodes = new Node(0, NullAnnotation); let
          current = newNodes;
        // Add new node for part before the removed span (if any).
        if (removeSpan.pos > oldPos) {
          current.next = new Node(removeSpan.pos - oldPos, old.annotation);
          current = current.next;
        }

        // Skip over removed nodes.
        while (removeSpan.end() > oldPos + old.length) {
          oldPos += old.length;
          old = old.next;
        }

        // Add new node for part after the removed span (if any).
        const afterChars = oldPos + old.length - removeSpan.end();
        if (afterChars > 0) {
          current.next = new Node(afterChars, old.annotation);
        }

        return newNodes.next;
      });
    };

    AnnotationList.prototype.updateSpan = function (span, updateFn) {
      if (span.length === 0) {
        return;
      }

      this.wrapOperation_(span, (oldPos, old) => {
        assert(old !== null);
        const newNodes = new Node(0, NullAnnotation); let current = newNodes; let
          currentPos = oldPos;

        // Add node for any characters before the span we're updating.
        const beforeChars = span.pos - currentPos;
        assert(beforeChars < old.length);
        if (beforeChars > 0) {
          current.next = new Node(beforeChars, old.annotation);
          current = current.next;
          currentPos += current.length;
        }

        // Add updated nodes for entirely updated nodes.
        while (old !== null && span.end() >= oldPos + old.length) {
          const length = oldPos + old.length - currentPos;
          current.next = new Node(length, updateFn(old.annotation, length));
          current = current.next;
          oldPos += old.length;
          old = old.next;
          currentPos = oldPos;
        }

        // Add updated nodes for last node.
        const updateChars = span.end() - currentPos;
        if (updateChars > 0) {
          assert(updateChars < old.length);
          current.next = new Node(updateChars, updateFn(old.annotation, updateChars));
          current = current.next;
          currentPos += current.length;

          // Add non-updated remaining part of node.
          current.next = new Node(oldPos + old.length - currentPos, old.annotation);
        }

        return newNodes.next;
      });
    };

    AnnotationList.prototype.wrapOperation_ = function (span, operationFn) {
      if (span.pos < 0) {
        throw new Error('Span start cannot be negative.');
      }
      const oldNodes = []; const
        newNodes = [];

      const res = this.getAffectedNodes_(span);

      let tail;
      if (res.start !== null) {
        tail = res.end.next;
        // Temporarily truncate list so we can pass it to operationFn.  We'll splice it back in later.
        res.end.next = null;
      } else {
        // start and end are null, because span is empty and lies on the border of two nodes.
        tail = res.succ;
      }

      // Create a new segment to replace the affected nodes.
      let newSegment = operationFn(res.startPos, res.start);

      let includePredInOldNodes = false; let
        includeSuccInOldNodes = false;
      if (newSegment) {
        this.mergeNodesWithSameAnnotations_(newSegment);

        let newPos;
        if (res.pred && res.pred.annotation.equals(newSegment.annotation)) {
          // We can merge the pred node with newSegment's first node.
          includePredInOldNodes = true;
          newSegment.length += res.pred.length;

          // Splice newSegment in after beforePred.
          res.beforePred.next = newSegment;
          newPos = res.predPos;
        } else {
          // Splice newSegment in after beforeStart.
          res.beforeStart.next = newSegment;
          newPos = res.startPos;
        }

        // Generate newNodes, but not the last one (since we may be able to merge it with succ).
        while (newSegment.next) {
          newNodes.push(new NewAnnotatedSpan(newPos, newSegment));
          newPos += newSegment.length;
          newSegment = newSegment.next;
        }

        if (res.succ && res.succ.annotation.equals(newSegment.annotation)) {
          // We can merge newSegment's last node with the succ node.
          newSegment.length += res.succ.length;
          includeSuccInOldNodes = true;

          // Splice rest of list after succ after newSegment.
          newSegment.next = res.succ.next;
        } else {
          // Splice tail after newSegment.
          newSegment.next = tail;
        }

        // Add last newSegment node to newNodes.
        newNodes.push(new NewAnnotatedSpan(newPos, newSegment));
      } else {
        // newList is empty.  Try to merge pred and succ.
        if (res.pred && res.succ && res.pred.annotation.equals(res.succ.annotation)) {
          includePredInOldNodes = true;
          includeSuccInOldNodes = true;

          // Create succ + pred merged node and splice list together.
          newSegment = new Node(res.pred.length + res.succ.length, res.pred.annotation);
          res.beforePred.next = newSegment;
          newSegment.next = res.succ.next;

          newNodes.push(new NewAnnotatedSpan(res.startPos - res.pred.length, newSegment));
        } else {
          // Just splice list back together.
          res.beforeStart.next = tail;
        }
      }

      // Build list of oldNodes.

      if (includePredInOldNodes) {
        oldNodes.push(new OldAnnotatedSpan(res.predPos, res.pred));
      }

      let oldPos = res.startPos; let
        oldSegment = res.start;
      while (oldSegment !== null) {
        oldNodes.push(new OldAnnotatedSpan(oldPos, oldSegment));
        oldPos += oldSegment.length;
        oldSegment = oldSegment.next;
      }

      if (includeSuccInOldNodes) {
        oldNodes.push(new OldAnnotatedSpan(oldPos, res.succ));
      }

      this.changeHandler_(oldNodes, newNodes);
    };

    AnnotationList.prototype.getAffectedNodes_ = function (span) {
      // We want to find nodes 'start', 'end', 'beforeStart', 'pred', and 'succ' where:
      //  - 'start' contains the first character in span.
      //  - 'end' contains the last character in span.
      //  - 'beforeStart' is the node before 'start'.
      //  - 'beforePred' is the node before 'pred'.
      //  - 'succ' contains the node after 'end' if span.end() was on a node boundary, else null.
      //  - 'pred' contains the node before 'start' if span.pos was on a node boundary, else null.

      const result = {};

      let prevprev = null; let prev = this.head_; let current = prev.next; let
        currentPos = 0;
      while (current !== null && span.pos >= currentPos + current.length) {
        currentPos += current.length;
        prevprev = prev;
        prev = current;
        current = current.next;
      }
      if (current === null && !(span.length === 0 && span.pos === currentPos)) {
        throw new Error('Span start exceeds the bounds of the AnnotationList.');
      }

      result.startPos = currentPos;
      // Special case if span is empty and on the border of two nodes
      if (span.length === 0 && span.pos === currentPos) {
        result.start = null;
      } else {
        result.start = current;
      }
      result.beforeStart = prev;

      if (currentPos === span.pos && currentPos > 0) {
        result.pred = prev;
        result.predPos = currentPos - prev.length;
        result.beforePred = prevprev;
      } else {
        result.pred = null;
      }

      while (current !== null && span.end() > currentPos) {
        currentPos += current.length;
        prev = current;
        current = current.next;
      }
      if (span.end() > currentPos) {
        throw new Error('Span end exceeds the bounds of the AnnotationList.');
      }

      // Special case if span is empty and on the border of two nodes.
      if (span.length === 0 && span.end() === currentPos) {
        result.end = null;
      } else {
        result.end = prev;
      }
      result.succ = (currentPos === span.end()) ? current : null;

      return result;
    };

    AnnotationList.prototype.mergeNodesWithSameAnnotations_ = function (list) {
      if (!list) {
        return;
      }
      let prev = null; let
        curr = list;
      while (curr) {
        if (prev && prev.annotation.equals(curr.annotation)) {
          prev.length += curr.length;
          prev.next = curr.next;
        } else {
          prev = curr;
        }
        curr = curr.next;
      }
    };

    AnnotationList.prototype.forEach = function (callback) {
      let current = this.head_.next;
      while (current !== null) {
        callback(current.length, current.annotation, current.attachedObject);
        current = current.next;
      }
    };

    AnnotationList.prototype.getAnnotatedSpansForPos = function (pos) {
      let currentPos = 0;
      let current = this.head_.next; let
        prev = null;
      while (current !== null && currentPos + current.length <= pos) {
        currentPos += current.length;
        prev = current;
        current = current.next;
      }
      if (current === null && currentPos !== pos) {
        throw new Error('pos exceeds the bounds of the AnnotationList');
      }

      const res = [];
      if (currentPos === pos && prev) {
        res.push(new OldAnnotatedSpan(currentPos - prev.length, prev));
      }
      if (current) {
        res.push(new OldAnnotatedSpan(currentPos, current));
      }
      return res;
    };

    AnnotationList.prototype.getAnnotatedSpansForSpan = function (span) {
      if (span.length === 0) {
        return [];
      }
      const oldSpans = [];
      const res = this.getAffectedNodes_(span);
      let currentPos = res.startPos; let
        current = res.start;
      while (current !== null && currentPos < span.end()) {
        const start = Math.max(currentPos, span.pos); const
          end = Math.min(currentPos + current.length, span.end());
        const oldSpan = new Span(start, end - start);
        oldSpan.annotation = current.annotation;
        oldSpans.push(oldSpan);

        currentPos += current.length;
        current = current.next;
      }
      return oldSpans;
    };

    // For testing.
    AnnotationList.prototype.count = function () {
      let count = 0;
      let current = this.head_.next; let
        prev = null;
      while (current !== null) {
        if (prev) {
          assert(!prev.annotation.equals(current.annotation));
        }
        prev = current;
        current = current.next;
        count++;
      }
      return count;
    };

    function Node(length, annotation) {
      this.length = length;
      this.annotation = annotation;
      this.attachedObject = null;
      this.next = null;
    }

    Node.prototype.clone = function () {
      const node = new Node(this.spanLength, this.annotation);
      node.next = this.next;
      return node;
    };

    return AnnotationList;
  }());
  window.AnnotationList = AnnotationList;
}(window));
