/***************************************************************************
    Lightweight Image Viewer for Pattern Recognition
    Replaces the Viewer.js v1.3.6 fork
    @Copyright (C) 2019-2026 | Panthera Corporation
***************************************************************************/

var findflag = false;
var slctd_imgs_clone = [];
var whichviewer;
var nextprev = "0";

function objectof(viewerType) {
  whichviewer = viewerType;
}

function resetwhichviewer() {
  whichviewer = "";
}

function selectionfind(flag) {
  findflag = flag;
}

function nextprevclicked(status) {
  nextprev = status;
}

function arrayclone(param) {
  slctd_imgs_clone = param.slice();
}

(function (global) {
  'use strict';

  var VIEWER_CSS_INJECTED = false;

  function injectCSS() {
    if (VIEWER_CSS_INJECTED) return;
    VIEWER_CSS_INJECTED = true;
    var style = document.createElement('style');
    style.textContent =
      '.piv-overlay {' +
        'position: fixed; top: 0; left: 0; width: 100%; height: 100%;' +
        'background: rgba(0,0,0,0.92); z-index: 99999;' +
        'display: flex; flex-direction: column;' +
      '}' +
      '.piv-toolbar {' +
        'display: flex; justify-content: space-between; align-items: center;' +
        'padding: 8px 16px; background: rgba(0,0,0,0.6); color: #fff;' +
        'font-size: 14px; font-family: sans-serif; z-index: 100001;' +
        'flex-shrink: 0;' +
      '}' +
      '.piv-title {' +
        'flex: 1; text-align: center; white-space: nowrap;' +
        'overflow: hidden; text-overflow: ellipsis; padding: 0 12px;' +
      '}' +
      '.piv-close-btn {' +
        'cursor: pointer; font-size: 28px; line-height: 1; padding: 4px 10px;' +
        'color: #fff; background: none; border: none; opacity: 0.8;' +
      '}' +
      '.piv-close-btn:hover { opacity: 1; }' +
      '.piv-canvas {' +
        'flex: 1; display: flex; align-items: center; justify-content: center;' +
        'overflow: hidden; position: relative; cursor: default;' +
      '}' +
      '.piv-image {' +
        'max-width: 92%; max-height: 88vh; object-fit: contain;' +
        'user-select: none; -webkit-user-select: none;' +
        'transition: transform 0.15s ease;' +
      '}' +
      '.piv-image.piv-dragging { cursor: grabbing; transition: none; }' +
      '.piv-nav {' +
        'position: absolute; top: 50%; transform: translateY(-50%);' +
        'font-size: 44px; color: #fff; background: rgba(0,0,0,0.35);' +
        'border: none; cursor: pointer; padding: 24px 14px; opacity: 0.7;' +
        'z-index: 100000; font-family: sans-serif; line-height: 1;' +
      '}' +
      '.piv-nav:hover { opacity: 1; background: rgba(0,0,0,0.6); }' +
      '.piv-nav-prev { left: 0; border-radius: 0 4px 4px 0; }' +
      '.piv-nav-next { right: 0; border-radius: 4px 0 0 4px; }' +
      '.piv-footer {' +
        'display: flex; justify-content: center; gap: 8px;' +
        'padding: 8px 16px; background: rgba(0,0,0,0.6);' +
        'z-index: 100001; flex-shrink: 0;' +
      '}' +
      '.piv-btn {' +
        'cursor: pointer; color: #fff; background: rgba(255,255,255,0.12);' +
        'border: 1px solid rgba(255,255,255,0.25); border-radius: 3px;' +
        'padding: 5px 12px; font-size: 13px; font-family: sans-serif;' +
        'opacity: 0.85;' +
      '}' +
      '.piv-btn:hover { opacity: 1; background: rgba(255,255,255,0.22); }';
    document.head.appendChild(style);
  }

  function Viewer(element, options) {
    if (!element || element.nodeType !== 1) return;
    if (element.__pivViewer) return element.__pivViewer;

    this.element = element;
    this.options = options || {};
    this.images = [];
    this.index = 0;
    this.isShown = false;
    this.overlay = null;
    this._zoom = 1;
    this._tx = 0;
    this._ty = 0;
    this._rotation = 0;

    this._boundKeyDown = this._onKeyDown.bind(this);
    this._boundWheel = this._onWheel.bind(this);

    element.__pivViewer = this;
    injectCSS();

    var self = this;
    element.addEventListener('click', function (e) {
      var target = e.target;
      if (target.tagName && target.tagName.toLowerCase() === 'img') {
        self._scanImages();
        var idx = -1;
        for (var i = 0; i < self.images.length; i++) {
          if (self.images[i].element === target) { idx = i; break; }
        }
        if (idx >= 0) {
          self.view(idx);
        }
      }
    });
  }

  Viewer.prototype._scanImages = function () {
    this.images = [];
    var imgs = this.element.querySelectorAll('img');
    var urlAttr = this.options.url || 'src';
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var src = (typeof urlAttr === 'string')
        ? (img.getAttribute(urlAttr) || img.src)
        : img.src;
      this.images.push({
        src: src,
        alt: img.alt || '',
        element: img
      });
    }
  };

  Viewer.prototype.view = function (index) {
    this._scanImages();
    if (this.images.length === 0) return this;

    index = Math.max(0, Math.min(Number(index) || 0, this.images.length - 1));
    var imgData = this.images[index];

    if (!this.isShown) {
      if (nextprev === "1") {
        nextprev = "0";
        return this;
      }
      if (findflag === true) {
        findflag = false;
        return this;
      }
    }

    if (whichviewer === "pttrn_rcgntn_vwr" && typeof pttrn_rcgntn_obj !== 'undefined') {
      var url = imgData.src;
      var selected = pttrn_rcgntn_obj.getSelectedImages();
      var removed = pttrn_rcgntn_obj.removedRef();
      if (selected.includes(url) || removed === url) {
        if (selected.includes(url) || slctd_imgs_clone.includes(url)) {
          if (this.isShown) this.hide();
          return this;
        }
      }
    }

    this.index = index;

    if (!this.isShown) {
      this._open();
    }
    this._renderImage();
    return this;
  };

  Viewer.prototype._open = function () {
    var self = this;
    this._zoom = 1;
    this._tx = 0;
    this._ty = 0;
    this._rotation = 0;

    var overlay = document.createElement('div');
    overlay.className = 'piv-overlay';
    overlay.innerHTML =
      '<div class="piv-toolbar">' +
        '<span></span>' +
        '<span class="piv-title"></span>' +
        '<button class="piv-close-btn" title="Close">&times;</button>' +
      '</div>' +
      '<div class="piv-canvas">' +
        '<button class="piv-nav piv-nav-prev" title="Previous">&#8249;</button>' +
        '<img class="piv-image" draggable="false" />' +
        '<button class="piv-nav piv-nav-next" title="Next">&#8250;</button>' +
      '</div>' +
      '<div class="piv-footer">' +
        '<button class="piv-btn" data-action="zoomin">+ Zoom In</button>' +
        '<button class="piv-btn" data-action="zoomout">&minus; Zoom Out</button>' +
        '<button class="piv-btn" data-action="reset">Reset</button>' +
        '<button class="piv-btn" data-action="rotl">&#8630; Rotate</button>' +
        '<button class="piv-btn" data-action="rotr">Rotate &#8631;</button>' +
      '</div>';

    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.isShown = true;

    overlay.querySelector('.piv-close-btn').addEventListener('click', function () {
      self.hide();
    });
    overlay.querySelector('.piv-nav-prev').addEventListener('click', function (e) {
      e.stopPropagation();
      self.prev();
    });
    overlay.querySelector('.piv-nav-next').addEventListener('click', function (e) {
      e.stopPropagation();
      self.next();
    });

    var canvas = overlay.querySelector('.piv-canvas');
    canvas.addEventListener('click', function (e) {
      if (e.target === canvas) self.hide();
    });

    overlay.querySelector('.piv-footer').addEventListener('click', function (e) {
      var action = e.target.getAttribute('data-action');
      if (!action) return;
      switch (action) {
        case 'zoomin': self._applyZoom(0.25); break;
        case 'zoomout': self._applyZoom(-0.25); break;
        case 'reset': self._resetTransform(); break;
        case 'rotl': self._applyRotation(-90); break;
        case 'rotr': self._applyRotation(90); break;
      }
    });

    this._setupDrag(overlay.querySelector('.piv-image'));
    document.addEventListener('keydown', this._boundKeyDown);
    overlay.addEventListener('wheel', this._boundWheel, { passive: false });
  };

  Viewer.prototype._setupDrag = function (img) {
    var self = this;
    var dragging = false, startX, startY, origTX, origTY;

    img.addEventListener('mousedown', function (e) {
      if (self._zoom <= 1) return;
      e.preventDefault();
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origTX = self._tx;
      origTY = self._ty;
      img.classList.add('piv-dragging');
    });

    this._dragMoveHandler = function (e) {
      if (!dragging) return;
      self._tx = origTX + (e.clientX - startX);
      self._ty = origTY + (e.clientY - startY);
      self._setTransform();
    };
    this._dragUpHandler = function () {
      if (!dragging) return;
      dragging = false;
      img.classList.remove('piv-dragging');
    };

    document.addEventListener('mousemove', this._dragMoveHandler);
    document.addEventListener('mouseup', this._dragUpHandler);
  };

  Viewer.prototype._setTransform = function () {
    var img = this.overlay ? this.overlay.querySelector('.piv-image') : null;
    if (!img) return;
    var z = this._zoom;
    var tx = this._tx / z;
    var ty = this._ty / z;
    img.style.transform =
      'scale(' + z + ') translate(' + tx + 'px,' + ty + 'px) rotate(' + this._rotation + 'deg)';
  };

  Viewer.prototype._resetTransform = function () {
    this._zoom = 1;
    this._tx = 0;
    this._ty = 0;
    this._rotation = 0;
    this._setTransform();
  };

  Viewer.prototype._applyZoom = function (delta) {
    this._zoom = Math.max(0.1, Math.min(10, this._zoom + delta));
    this._setTransform();
  };

  Viewer.prototype._applyRotation = function (deg) {
    this._rotation += deg;
    this._setTransform();
  };

  Viewer.prototype._renderImage = function () {
    if (!this.overlay || this.images.length === 0) return;
    var img = this.overlay.querySelector('.piv-image');
    var title = this.overlay.querySelector('.piv-title');
    var data = this.images[this.index];

    img.src = data.src;
    img.alt = data.alt;

    var titleFn = this.options.title;
    if (typeof titleFn === 'function') {
      title.textContent = titleFn.call({ index: this.index, length: this.images.length }, data);
    } else {
      title.textContent = data.alt + ' (' + (this.index + 1) + '/' + this.images.length + ')';
    }

    this._zoom = 1;
    this._tx = 0;
    this._ty = 0;
    this._rotation = 0;
    this._setTransform();
  };

  Viewer.prototype.prev = function () {
    if (this.images.length === 0) return this;
    this.index = this.index > 0 ? this.index - 1 : this.images.length - 1;
    this._renderImage();
    return this;
  };

  Viewer.prototype.next = function () {
    if (this.images.length === 0) return this;
    this.index = this.index < this.images.length - 1 ? this.index + 1 : 0;
    this._renderImage();
    return this;
  };

  Viewer.prototype.hide = function () {
    if (!this.isShown) return this;
    this.isShown = false;
    document.removeEventListener('keydown', this._boundKeyDown);
    if (this._dragMoveHandler) document.removeEventListener('mousemove', this._dragMoveHandler);
    if (this._dragUpHandler) document.removeEventListener('mouseup', this._dragUpHandler);
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    return this;
  };

  Viewer.prototype.show = function () {
    this._scanImages();
    if (this.images.length === 0) return this;
    if (!this.isShown) {
      this._open();
      this._renderImage();
    }
    return this;
  };

  Viewer.prototype.destroy = function () {
    this.hide();
    if (this.element) {
      delete this.element.__pivViewer;
    }
  };

  Viewer.prototype._onKeyDown = function (e) {
    if (!this.isShown) return;
    switch (e.keyCode) {
      case 27: this.hide(); break;
      case 37: this.prev(); break;
      case 39: this.next(); break;
      case 38: e.preventDefault(); this._applyZoom(0.1); break;
      case 40: e.preventDefault(); this._applyZoom(-0.1); break;
    }
  };

  Viewer.prototype._onWheel = function (e) {
    if (!this.isShown) return;
    e.preventDefault();
    this._applyZoom(e.deltaY > 0 ? -0.1 : 0.1);
  };

  global.Viewer = Viewer;

})(window);
