class WhiteboardCircle  extends WhiteboardCommonShape {
  constructor(name) {
    super(name);
    this.name = name;
  }

  mouseMove(pointer, whiteboard) {
    if (!virtualclass.gObj.lastSendDataTime) {
      virtualclass.gObj.lastSendDataTime = new Date().getTime();
    }

    const newData = {
      event: 'm',
      name: this.name,
      x: pointer.x,
      y: pointer.y
    };
    virtualclass.wbWrapper.msg.optimizeToSend(newData, 2000, 'sp');
    this.innerMouseMove(pointer, whiteboard);
  }

  innerMouseMove(pointer, whiteboard) {
    if (!this.mousedown) return;
    const newLeft = pointer.x;
    const newTop = pointer.y;

    const radius = Math.abs(this.startTop - newTop) / 2;
    console.log('====> my radius ', radius);

    this.circle.set({ radius : radius});

    if ( this.startLeft > newLeft) {
      this.circle.set({originX: 'right' });
    } else {
      this.circle.set({originX: 'left' });
    }

    if (this.startTop > newTop) {
      this.circle.set({originY: 'bottom'  });
    } else {
      this.circle.set({originY: 'top'  });
    }
     whiteboard.canvas.renderAll();
  }
}