<template>
  <div class="app">
    <div class="operate-con">
      <span>操作：</span>
      <button @click="addNode">添加节点</button>
      <button @click="addBrother">添加同级</button>
      <button @click="onRemoveNode">删除节点</button>
      <button @click="onMoveUpOne">上移</button>
      <button @click="onMoveDownOne">下移</button>
      <button @click="onMoveUp">移动到最上方</button>
      <button @click="onMoveDown">移动到最下方</button>
      <button @click="screenshot">快照</button>
      <button @click="zoomOut" ref="zoomOut">Out</button>
      <button @click="zoomIn" ref="zoomIn">In</button>
    </div>
    <js-mind
      :values="mind"
      :options="options"
      ref="jsMind"
      height="700px"
    ></js-mind>
  </div>
</template>

<script>
export default {
  data() {
    let _this = this;
    return {
      theme_value: "",
      mind: {
        /* 元数据，定义思维导图的名称、作者、版本等信息 */
        meta: {
          name: "example",
          author: "906106844@qq.com",
          version: "0.2"
        },
        /* 数据格式声明 */
        format: "node_tree", // node_tree node_array
        /* 数据内容 */
        data: {
          id: "root",
          topic: "jsMind",
          children: [
            {
              id: "easy",
              topic: "Easy",
              direction: "left",
              expanded: true,
              children: [
                {id: 'easy1', topic: 'Easy to show', quote: 0},
                {id: 'easy2', topic: 'Easy to edit',bindData:1,bindProduct:0},
                // {id: 'easy3', topic: 'Easy to store', quote: 0,bindProduct:1},
                // {id: 'easy4', topic: 'Easy to embed', quote: 1},
              ]
            },
            {
              id: "open",
              topic: "Open Source",
              direction: "right",
              expanded: false,
              quote: 1,
              children: [
                { id: "open1", topic: "on GitHub" },
                { id: "open2", topic: "BSD License" }
              ]
            },
            // {
            //   id: "powerful",
            //   topic: "Powerful",
            //   direction: "right",
            //   children: [
            //     { id: "powerful1", topic: "Base on Javascript" },
            //     { id: "powerful2", topic: "Base on HTML5" },
            //     { id: "powerful3", topic: "Depends on you" }
            //   ]
            // },
            // {
            //   id: "other",
            //   topic: "test node",
            //   direction: "left",
            //   children: [
            //     { id: "other1", topic: "I'm from local variable" },
            //     { id: "other2", topic: "I can do everything" }
            //   ]
            // }
          ]
        }
      },
      menuList: [
        {
          target: "indexDetail",
          text: "查看信息",
          callback: function(node) {
            console.log("查看信息:", node);
            alert(`查看信息:${node.topic}`)
          }
        },
        {
          target: "addChild",
          text: "新增子级",
          callback: function(node) {
            console.log("新增子级:", node);
            var selected_node = _this.$refs.jsMind.jm.get_selected_node(); // as parent of new node
            if (!selected_node) {
              alert("please select a node first.");
              return;
            }

            var nodeid = jsMind.util.uuid.newid();
            var topic = "new Node";
            var node = _this.$refs.jsMind.jm.add_node(selected_node, nodeid, topic);
          }
        },
        {
          target: "addBrother",
          text: "新增同级",
          callback: function(node) {
            console.log("新增同级:", node);
            var nodeid = jsMind.util.uuid.newid();
            var topic = "new Node";
            var tarNode=_this.$refs.jsMind.jm.get_node(node.parent.id)
            console.log(`tarNode`, tarNode)
            var node = _this.$refs.jsMind.jm.add_node(tarNode, nodeid, topic);
          }
        },
        {
          target: "deleteNode",
          text: "删除节点",
          callback: function(node) {
            console.log("删除节点:", node);
            _this.$refs.jsMind.jm.remove_node(node.id);
          }
        },
        {
          target: "moveNodeUp",
          text: "上移节点",
          callback: function(node) {
            console.log("上移节点:", node);
            _this.$refs.jsMind.jm.move_node(node, '_up_one_');
          }
        },
        {
          target: "moveNodeDown",
          text: "下移节点",
          callback: function(node) {
            console.log("下移节点:", node);
            _this.$refs.jsMind.jm.move_node(node, '_down_one_');
          }
        }
      ],
      options: {
        mode: "side",
        asyncNext:true,
        /**
         * 请求下一层节点数据
         * node 当前节点
         * return 当前及子节点
         */
        nextLevelFn: function (node) {
          return new Promise(function(resolve, reject) {
            setTimeout(() => {
              let newNode={
                nodeid:node.id,
                topic:node.topic,
                child:[]
              }
              for (let index = 0; index < 2; index++) {
                  var nodeid = jsMind.util.uuid.newid();
                  var topic = "new Node";
                  var data={
                      hasNextNode:false
                  }
                  if (index%2 ==0) {
                      data.hasNextNode=true
                  }else{
                      data.hasNextNode=false
                  }
                  newNode.child.push(
                    {
                      nodeid:nodeid,
                      topic:topic+nodeid,
                      data:data
                    }
                  )
              }
              console.log(`1`, 1);
              resolve(newNode); // 代码正常执行！
            }, 1000);
          });
          // return _this.fetchNodeData(node);
        },
        classFn: function(node) {
          let { quote, bindData, bindProduct } = node.data;
          let classRes = "";
          /**
           * quote        0 非引用    1 引用
           * bindData     0 无绑定指标 1 有绑定指标
           * bindProduct  0 无绑定产品 1 有绑定产品
           */
          if (quote) {
            if (bindData && bindProduct) {
              classRes += " quoteBindIndexProd";
            } else if (bindData) {
              classRes += " quoteBindIndex";
            } else if (bindProduct) {
              classRes += " quoteBindProd";
            } else {
              classRes += " quote";
            }
          } else {
            if (bindData && bindProduct) {
              classRes += " bindIndexProd";
            } else if (bindData) {
              classRes += " bindIndex";
            } else if (bindProduct) {
              classRes += " bindProd";
            }
          }
          return classRes;
        },
        /**
         * tooltip
         */
        tooltipFn: function(node) {
          if (node.isroot) {
            return [
              {
                label: "根节点名称",
                value: node.topic
              }
            ];
          } else {
            return [
              {
                label: "节点名称",
                value: node.topic
              },
              {
                label: "节点ID",
                value: node.id
              }
            ];
          }
        },
        /**
         * 拖拽回调函数
         * src 拖拽节点
         * target 拖拽至目标节点
         */
        dragFn: function(src, target) {
          console.log(`src`, src);
          console.log(`target`, target);
          return new Promise(function(resolve, reject) {
            setTimeout(() => {
              console.log(`1`, 1);
              resolve(1); // 代码正常执行！
            }, 0);
          });
        },
        menuOpts: {
          showMenu: true,
          /**
           * 重新初始化菜单
           * node 操作节点
           */
          initMenu: function(node) {
            if (!node) {
              return [];
            }
            if (node.isroot) {
              _this.options.menuOpts.injectionList = _this.showMenuList([
                "indexDetail",
                "addChild",
              ]);
            }else{
              _this.options.menuOpts.injectionList = _this.showMenuList([
                "indexDetail",
                "addChild",
                "addBrother",
                "deleteNode",
                "moveNodeUp",
                "moveNodeDown",
              ]);
            }
          },
          injectionList: []
        }
      },
      shortCutVal: "",
      keyCode: ""
    };
  },

  methods: {
    // 菜单展示
    showMenuList(arr) {
      let objMenu = {};
      let arrShow = [];
      this.menuList.forEach(item => {
        objMenu[item.target] = item;
      });

      arr.forEach(item => {
        arrShow.push(objMenu[item]);
      });
      return arrShow;
    },
    addNode() {
      var selected_node = this.jm.get_selected_node(); // as parent of new node
      if (!selected_node) {
        alert("please select a node first.");
        return;
      }

      var nodeid = jsMind.util.uuid.newid();
      var topic = "new Node";
      var node = this.jm.add_node(selected_node, nodeid, topic);
      console.log("this.data", this.data);
    },
    addBrother() {
      var selected_node = this.jm.get_selected_node(); // as parent of new node
      if (!selected_node) {
        alert("please select a node first.");
        return;
      }
      console.log("新增同级:", node);
      var nodeid = jsMind.util.uuid.newid();
      var topic = "new Node";
      var tarNode=this.$refs.jsMind.jm.get_node(selected_node.parent.id)
      console.log(`tarNode`, tarNode)
      var node = this.$refs.jsMind.jm.add_node(tarNode, nodeid, topic);
    },
    onMoveUp() {
      var selected_id = this.jm.get_selected_node();
      if (!selected_id) {
        alert("please select a node first.");
        return;
      }
      this.jm.move_node(selected_id, "_first_");
    },
    onMoveUpOne() {
      var selected_id = this.jm.get_selected_node();
      if (selected_id.index <= 1) {
        alert("不可上移！");
        return;
      }
      if (!selected_id) {
        alert("please select a node first.");
        return;
      }

      this.jm.move_node(selected_id, "_up_one_");
    },
    onMoveDownOne() {
      var selected_id = this.jm.get_selected_node();

      console.log(`selected_id`, selected_id);
      if (!selected_id) {
        alert("please select a node first.");
        return;
      }
      if (selected_id.index >= selected_id.parent.children.length) {
        alert("不可下移！");
        return;
      }

      this.jm.move_node(selected_id, "_down_one_");
    },
    onMoveDown() {
      var selected_id = this.jm.get_selected_node();
      if (!selected_id) {
        alert("please select a node first.");
        return;
      }

      this.jm.move_node(selected_id, "_last_");
    },
    onRemoveNode() {
      var selected_id = this.get_selected_nodeid();
      console.log(selected_id);
      if (!selected_id) {
        alert("please select a node first.");
        return;
      }
      this.jm.remove_node(selected_id);
    },
    zoomOut() {
      if (this.jm.view.zoomOut()) {
        this.$refs.zoomIn.disabled = false;
      } else {
        this.$refs.zoomOut.disabled = true;
      }
    },
    zoomIn() {
      if (this.jm.view.zoomIn()) {
        this.$refs.zoomOut.disabled = false;
      } else {
        this.$refs.zoomIn.disabled = true;
      }
    },
    screenshot() {
      this.jm.screenshot.shootDownload();
    },
    // 获取选中标签的 ID
    get_selected_nodeid() {
      var selected_node = this.jm.get_selected_node();
      if (!!selected_node) {
        return selected_node.id;
      } else {
        return null;
      }
    },
  },

  mounted() {
    this.jm = this.$refs.jsMind.jm;
    this.jm.enable_edit();
  }
};
</script>

<style>
.app {
  width: 1400px;
  margin: 20px auto;
}
.operate-con{
  height: 50px;
  padding: 10px;
}
button{
  text-align: center;
  height: 30px;
  line-height: 30px;
  border: 1px solid #76b1f5;
  border-radius: 5px;
  background: #6da4e4;
  color: #fff;
  margin-right: 10px;
  cursor: pointer;
  padding: 0 10px;
}
button:hover{
  background: #76b1f5;
}
</style>
