function OrderedList() {
  this.ol = {};
  this.ol.order = [];
  this.ol.list = {};
}

OrderedList.prototype.insert = function (id, data, position) {
  if (position != null || position === 0) {
    this.ol.order.splice(position, 0, id);
  } else {
    this.ol.order.push(id);
  }
  if (data) {
    this.ol.list[id] = data;
  }
};

OrderedList.prototype.remove = function (position) {
  this.ol.order.splice(position, 1);
};

OrderedList.prototype.removeByID = function (id) {
  const position = this.ol.order.indexOf(id);
  this.ol.order.splice(position, 1);
};

OrderedList.prototype.getNext = function (position) {
  position += 1;
  return { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
};

OrderedList.prototype.getPrevious = function (position) {
  position -= 1;
  return { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
};

OrderedList.prototype.getNextByID = function (id) {
  const position = this.ol.order.indexOf(id) + 1;
  return { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
};

OrderedList.prototype.getPreviousByID = function (id) {
  const position = this.ol.order.indexOf(id) - 1;
  return { id: this.ol.order[position], data: this.ol.list[this.ol.order[position]] };
};

OrderedList.prototype.getOrder = function () {
  return this.ol.list.join(',');
};

OrderedList.prototype.loadOrder = function (order) {
  this.ol.list = order.split(',');
};

OrderedList.prototype.setID = function (id, data) {
  this.ol.list[id] = data;
};

OrderedList.prototype.loadList = function (list) {
  this.ol.list = list;
};

OrderedList.prototype.reset = function () {
  this.ol = {};
  this.ol.order.length = 0;
  this.ol.list = {};
};
