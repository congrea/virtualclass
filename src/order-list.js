class OrderedList {
  constructor() {
    this.ol = {};
    this.ol.order = [];
    this.ol.list = {};
  }

  insert(id, data, position) {
    if (position != null || position === 0) {
      this.ol.order.splice(position, 0, id);
    } else {
      this.ol.order.push(id);
    }
    if (data) {
      this.ol.list[id] = data;
    }
  }

  remove(position) {
    this.ol.order.splice(position, 1);
  }

  removeByID(id) {
    const position = this.ol.order.indexOf(id);
    this.ol.order.splice(position, 1);
  }

  getNext(position) {
    position += 1;
    const obj = { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
    return obj;
  }

  getPrevious(position) {
    position -= 1;
    const obj = { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
    return obj;
  }

  getNextByID(id) {
    const position = this.ol.order.indexOf(id) + 1;
    const obj = { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
    return obj;
  }

  getPreviousByID(id) {
    const position = this.ol.order.indexOf(id) - 1;
    const obj = { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
    return obj;
  }

  getOrder() {
    return this.ol.list.join(',');
  }

  loadOrder(order) {
    this.ol.list = order.split(',');
  }

  setID(id, data) {
    this.ol.list[id] = data;
  }

  loadList(list) {
    this.ol.list = list;
  }

  reset() {
    this.ol = {};
    this.ol.order.length = 0;
    this.ol.list = {};
  }

  overrideOrder(order) {
    this.ol.order = order;
  }

  getCurrentPosition(id) {
    return this.ol.order.indexOf(id);
  }
}
