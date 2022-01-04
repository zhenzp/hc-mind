(function ($w, temp) {
  var Jm = $w[temp]

  var name = "menu"

  var $d = $w["document"]

  var menuEvent = "oncontextmenu"

  var clickEvent = "onclick"

  // var overEvent = "mouseover"

  var $c = function (tag) {
    return $d.createElement(tag)
  }

  var _noop = function () {}

  var logger = (typeof console === "undefined") ? {

    log: _noop,
    debug: _noop,
    error: _noop,
    warn: _noop,
    info: _noop

  } : console

  var $t = function (n, t) {
    if (n.hasChildNodes()) {
      n.firstChild.nodeValue = t
    } else {
      n.appendChild($d.createTextNode(t))
    }
  }

  var $h = function (n, t) {
    if (t instanceof HTMLElement) {
      t.innerHTML = ""
      n.appendChild(t)
    } else {
      n.innerHTML = t
    }
  }

  if (!Jm || Jm[name]) return

  Jm.menu = function (_jm) {
    this._get_menu_options(_jm, function () {
      this.init(_jm)
      this._mount_events()
    })
  }
  Jm.menu.prototype = {

    defaultDataMap: {
      funcMap: {
        editNode: {
          isDepNode: true,
          fn: _noop,
          text: "编辑节点"
        },
        addChild: {
          isDepNode: true,
          fn: _noop,
          text: "新增子级"
        },
        addBrother: {
          isDepNode: true,
          fn: _noop,
          text: "新增同级"
        },
        moveNode: {
          isDepNode: true,
          fn: _noop,
          text: "移动"
        },
        deleteNode: {
          isDepNode: true,
          fn: _noop,
          text: "删除"
        },
        copyNode: {
          isDepNode: true,
          fn: _noop,
          text: "复制"
        },
        pasteNode: {
          isDepNode: true,
          fn: _noop,
          text: "粘贴"
        },
        moveNodeUp: {
          isDepNode: true,
          fn: _noop,
          text: "上移"
        },
        moveNodeDown: {
          isDepNode: true,
          fn: _noop,
          text: "下移"
        },
        indexEdit: {
          isDepNode: true,
          fn: _noop,
          text: "指标编辑"
        },
        indexDetail: {
          isDepNode: true,
          fn: _noop,
          text: "查看映射"
        },
        productEdit: {
          isDepNode: true,
          fn: _noop,
          text: "产品编辑"
        },
        productDetail: {
          isDepNode: true,
          fn: _noop,
          text: "查看产品"
        },
        // edit: {
        //   isDepNode: true,
        //   // defaultFn不受到中台变量的控制，始终会先于fn去执行
        //   defaultFn: function (node) {
        //     var f = this._menu_default_mind_methods._menu_begin_edit.call(this.jm)
        //     f && this._menu_default_mind_methods._menu_edit_node_begin(this.jm.view, node)
        //   },
        //   fn: _noop,
        //   text: "edit node"
        // },
        // addChild: {
        //   isDepNode: true,
        //   fn: function (nodeid, text) {
        //     var selected_node = this.get_selected_node()
        //     if (selected_node) {
        //       var node = this.add_node(selected_node, nodeid, text)
        //       if (node) {
        //         this.select_node(nodeid)
        //         this.begin_edit(nodeid)
        //       }
        //     }
        //   },
        //   text: "append child"
        // },
        // addBrother: {
        //   isDepNode: true,
        //   fn: function (nodeid, text) {
        //     var selected_node = this.get_selected_node()
        //     if (!!selected_node && !selected_node.isroot) {
        //       var node = this.insert_node_after(selected_node, nodeid, text)
        //       if (node) {
        //         this.select_node(nodeid)
        //         this.begin_edit(nodeid)
        //       }
        //     }
        //   },
        //   text: "append brother"
        // },
        // delete: {
        //   isDepNode: true,
        //   fn: function () {
        //     this.shortcut.handle_delnode.call(this.shortcut, this)
        //   },
        //   text: "delete node"
        // },
        showAll: {
          sDepNode: false,
          fn: function () {
            this.expand_all(this)
          },
          text: "show all"
        },
        hideAll: {
          isDepNode: false,
          fn: function () {
            this.collapse_all(this)
          },
          text: "hide all"
        },
        screenshot: {
          isDepNode: false,
          fn: function () {
            if (!this.screenshot) {
              logger.error("[jsmind] screenshot dependent on jsmind.screenshot.js !")
              return
            }
            this.screenshot.shootDownload()
          },
          text: "load mind picture"
        },
        showNode: {
          isDepNode: true,
          fn: function (node) {
            this.expand_node(node)
          },
          text: "show target node"
        },
        hideNode: {
          isDepNode: true,
          fn: function (node) {
            this.collapse_node(node)
          },
          text: "hide target node"
        }
      },
      menuStl: {
        "width": "100px",
        "padding": "12px 0",
        "position": "absolute",
        "z-index": "101",
        "background": "#fff",
        "box-shadow": "0 2px 12px 0 rgba(0,0,0,0.1)",
        "border-radius": "5px",
        "font-size": "12px",
        "display": "none",
      },
      menuItemStl: {
        padding: "5px 15px",
        cursor: "pointer",
        display: "block",
        "font-size": "12px",
        "text-align": "center",
        "font-family":'PingFangSC-Regular,Microsoft YaHei',
        "transition": "all .2s"
      },
      injectionList: ["edit", "addChild", "delete"]
    },

    init: function (_jm) {
      this._create_menu(_jm)
      this._get_injectionList(_jm)
      this.menuOpts.switchMidStage && Jm.util.dom.add_event(_jm.view.e_editor, "blur", function (e) {
        this._menu_default_mind_methods._menu_edit_node_end.call(_jm.view)
        if (typeof this.menuOpts.editCaller === "function") {
          this.menuOpts.editCaller($w.menu._update_node_info, this._menu_default_mind_methods._menu_update_edit_node)
          return
        }
        this._menu_default_mind_methods._menu_update_edit_node()
      }.bind(this))
    },

    _event_contextMenu(e) {
      e.preventDefault()
      this.selected_node = this.jm.get_selected_node()
      // 点击节点外不出现右键菜单
      if (this.selected_node) {
        var node=this.jm.get_node(this.selected_node.id)
        if(document.querySelector('#menu-con')){
          document.querySelector('#menu-con').remove();
        }
        this.jm.options.menuOpts.initMenu(this.selected_node)
        this.init(this.jm)
          // 菜单位置由鼠标位置改为节点位置 更精准
          var menuLeft = (node._data.view.abs_x+node._data.view.width)*this.jm.view.actualZoom
          var menuTop = (node._data.view.abs_y+ node._data.view.height)*this.jm.view.actualZoom
          this.menu.style.top = menuTop + "px"
          this.menu.style.left = menuLeft + "px"
          this.menu.style.display = "block"
      }
    },

    _event_hideMenu() {
      if(document.querySelector('#menu-con')){
        document.querySelector('#menu-con').remove();
      }
    },

    _mount_events() {
      $w[menuEvent] = this._event_contextMenu.bind(this)
      $w[clickEvent] = this._event_hideMenu.bind(this)
    },

    _create_menu(_jm) {
      var d = $c("menu")
      d.id="menu-con"
      this._set_menu_wrap_syl(d)
      this.menu = d
      this.e_panel = _jm.view.e_panel
      this.e_panel.appendChild(d)
    },

    _create_menu_item(j, text, fn, isDepNode, cb, defaultFn,k) {
      var d = $c("menu-item");
      var _this = this
      this._set_menu_item_syl(d)
      d.innerText = text
      d.id=k.target
      if(k.disabled){
          d.style.cursor="not-allowed";
          d.style.opacity=.6
      }
      d.addEventListener("click", function () {
        if(k.disabled){
          return
        }
        if (this.selected_node || !isDepNode) {
          defaultFn.call(_this, this.selected_node)
          if (!_this._get_mid_opts()) {
            cb(this.selected_node, _noop)
            fn.call(j, Jm.util.uuid.newid(), this.menuOpts.newNodeText || "请输入节点名称")
            return
          }
          cb(this.selected_node, _this._mid_stage_next(function () {
            var retArgs = [this.selected_node]
            var argus = Array.prototype.slice.call(arguments[0], 0)
            argus[1] = this.menuOpts.newNodeText || "请输入节点名称"
            if (argus[0]) {
              retArgs = argus
            }
            fn.apply(j, retArgs)
          }.bind(this)))
          return
        }
        alert(this.menuOpts.tipContent || "Continue with node selected！")
      }.bind(this))
      d.addEventListener("mouseover", function () {

        if(k.disabled){
          return
      }
        d.style.background = "rgb(179, 216, 255)"
      })
      d.addEventListener("mouseleave", function () {
        if(k.disabled){
          return
      }
        d.style.background = "#fff"
      })
      return d
    },

    _set_menu_wrap_syl(d) {
      var os = this._get_option_sty("menu", this._get_mixin_sty)
      d.style.cssText = this._format_cssText(os)
    },

    _set_menu_item_syl(d) {
      var os = this._get_option_sty("menuItem", this._get_mixin_sty)
      d.style.cssText = this._format_cssText(os)
    },

    _format_cssText(o) {
      var text = ""
      Object.keys(o).forEach(function (k) {
        text += k + ":" + o[k] + ";"
      })
      return text
    },

    _empty_object(o) {
      return Object.keys(o).length == 0
    },

    _get_option_sty(type, fn) {
      var sty = this.menuOpts.style
      var menu = this.defaultDataMap.menuStl
      var menuItem = this.defaultDataMap.menuItemStl
      var o = {
        menu,
        menuItem
      }
      if (!sty) return o[type]
      if (!sty[type]) return o[type]
      if (!sty[type] || this._empty_object(sty[type])) return o[type]
      return fn(o[type], sty[type])
    },

    _get_mixin_sty(dSty, oSty) {
      var o = {}
      Object.keys(oSty).forEach(function (k) {
        o[k] = oSty[k]
      })
      Object.keys(dSty).forEach(function (k) {
        if (!o[k]) o[k] = dSty[k]
      })
      return o
    },

    _get_menu_options(j, fn) {
      var options = j.options
      if (!options.menuOpts) return
      if (!options.menuOpts.showMenu) return
      this.menuOpts = j.options.menuOpts
      fn.call(this)
    },

    _get_injectionDetail() {
      var iLs = this.menuOpts.injectionList
      var dLs = this.defaultDataMap.injectionList
      if(iLs.length == 0) return []
      if (!iLs) return dLs
      if (!Array.isArray(iLs)) {
        logger.error("[jsmind] injectionList must be a Array")
        return
      }
      if (iLs.length == 0) return dLs
      return iLs
    },

    _get_injectionList(j) {
      var list = this._get_injectionDetail()
      if(list.length == 0) return
      var _this = this
      list.forEach(function (k) {
        var o = null
        var text = ""
        var callback = _noop
        var defaultFn = _noop
        
        
        if (typeof k === "object") {
          o = _this.defaultDataMap.funcMap[k.target]
          text = k.text
          k.callback && (callback = k.callback)
        } else {
          o = _this.defaultDataMap.funcMap[k]
          text = o.text
        }

        if (o.defaultFn) defaultFn = o.defaultFn
        _this.menu.appendChild(_this._create_menu_item(j, text, o.fn, o.isDepNode, callback, defaultFn,k))
      })
    },

    _get_mid_opts() {
      var b = this.menuOpts.switchMidStage
      if (!b) return false
      if (typeof b !== "boolean") {
        logger.error("[jsmind] switchMidStage must be Boolean")
        return false
      }
      return b
    },

    _switch_view_db_event(b, jm) {
      Jm.shortcut_provider.prototype.handler = _noop
      Jm.view_provider.prototype.edit_node_end = _noop
    },

    _mid_stage_next(fn) {
      return function () {
        fn(arguments)
      }
    },

    _reset_mind_event_edit() {},

    _menu_default_mind_methods: {
      _menu_begin_edit: function () {
        var f = this.get_editable()
        if (!f) {
          logger.error("fail, this mind map is not editable.")
        };
        return f
      },
      _menu_edit_node_begin(scope, node) {
        if (!node.topic) {
          logger.warn("don't edit image nodes")
          return
        }
        if (scope.editing_node != null) {
          this._menu_default_mind_methods._menu_edit_node_end.call(scope)
        }
        scope.editing_node = node
        var view_data = node._data.view
        var element = view_data.element
        var topic = node.topic
        var ncs = getComputedStyle(element)
        scope.e_editor.value = topic
        scope.e_editor.style.width = (element.clientWidth - parseInt(ncs.getPropertyValue("padding-left")) - parseInt(ncs.getPropertyValue("padding-right"))) + "px"
        element.innerHTML = ""
        element.appendChild(scope.e_editor)
        element.style.zIndex = 5
        scope.e_editor.focus()
        scope.e_editor.select()
      },
      _menu_edit_node_end: function () {
        if (this.editing_node != null) {
          var node = this.editing_node
          this.editing_node = null
          var view_data = node._data.view
          var element = view_data.element
          var topic = this.e_editor.value
          element.style.zIndex = "auto"
          element.removeChild(this.e_editor)
          $w.menu._update_node_info = {
            id: node.id,
            topic: topic
          }
          if (Jm.util.text.is_empty(topic) || node.topic === topic) {
            if (this.opts.support_html) {
              $h(element, node.topic)
            } else {
              $t(element, node.topic)
            }
          }
        }
      },
      _menu_update_edit_node: function () {
        var info = $w.menu._update_node_info
        $w.menu.jm.update_node(info.id, info.topic)
      }
    }

  }
  var plugin = new Jm.plugin("menu", function (_jm) {
    $w.menu = new Jm.menu(_jm)

    menu.jm = _jm

    if (menu.menuOpts) _jm.menu = menu
  })

  Jm.register_plugin(plugin)

  function preventMindEventDefault() {
    Jm.menu.prototype._switch_view_db_event()
  }
  Jm.preventMindEventDefault = preventMindEventDefault
})(window, "jsMind")