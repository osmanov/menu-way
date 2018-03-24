(function () {
  'use strict';

  function Item(options, menu) {
    this._init();
    this._setId(options.id)
    this._setMenu(menu)
    this._setIconHTML(options.icon);
    this.setTitle(options.title);
    this.setLink(options.link || null);

  }

  Item.prototype = {
    _init: function () {
      this._events = {
        'toggle': []
      }

      this.el = document.createElement('li');
      var self = this;

      this.el.addEventListener('click', function (e) {
        var event = self._events.toggle;
        for (var i = 0; i < event.length; i++) {
          event[i](self, e);
        }
      })
    },
    _setId: function (value) {
      this._id = value;
    },
    _setMenu: function (menu) {
      this._menu = menu;
    },
    _setIconHTML: function (value) {
      this._iconHTML = "<i class='fa fa-fw fa-" + value + "'></i>";
    },
    _setTitleHTML: function () {
      var link = this.getLink()
      if (link) {
        return this._titleHTML = "<a href='" + link + "'>" + this.getTitle() + "</a>";
      }
      this._titleHTML = "<span>" + this.getTitle() + "</span>";
    },
    setLink: function (value) {
      this._link = value;
      this._setTitleHTML();
    },
    setTitle: function (value) {
      this._title = value;
    },
    getId: function () {
      return this._id;
    },
    _getMenu: function () {
      return this._menu;
    },
    _getIconHTML: function () {
      return this._iconHTML;
    },
    getTitleHTML: function () {
      return this._titleHTML;
    },
    getLink: function () {
      return this._link;
    },
    getTitle: function () {
      return this._title;
    },
    isCurrent: function () {
      return window.location.pathname === this.getLink()
    },
    appendHTML: function (html) {
      this.el.insertAdjacentHTML('beforeEnd', html)
    },
    toggleActive: function () {
      this.el.classList.toggle('active');
    },
    on: function (name, cb) {
      this._events[name].push(cb);
    },
    render: function () {
      if (this.isCurrent()) {
        this.el.classList.add('active');
      }
      this.el.insertAdjacentHTML('afterBegin', this._getIconHTML() + this.getTitleHTML())
      this._menu.el.appendChild(this.el);
    }
  }


  function Menu(config) {
    this._init();
    this.setItems(config)
  }

  Menu.prototype = {
    _init: function () {
      this._items = [];
      this._itemsOrder = [];
      this.el = document.createElement('ul');
    },
    setItems: function (items) {
      for (var i = 0; i < items.length; i++) {
        this._items.push(new Item(items[i], this));
        this._itemsOrder.push(items[i].id);
      }
    },
    getItemById: function (id) {
      var index = this._itemsOrder.indexOf(id);
      return this.getItemByIndex(index);
    },
    getItemByIndex: function (index) {
      return this._items[index];
    },
    getCurrentItem: function () {
      for (var i = 0; i < this._items.length; i++) {
        if (this._items[i].isCurrent()) {
          return this._items[i];
        }
      }
    },
    renderTo: function (parentEl) {
      for (var i = 0; i < this._items.length; i++) {
        this._items[i].render()
      }
      parentEl.appendChild(this.el)
    },
  };

  var pageMenu = new Menu(Config.menu);
  pageMenu.renderTo(document.querySelector('.navbar'));
  pageMenu.getItemByIndex(1).on('toggle', function (item) {
    item.toggleActive();
  });

}());

