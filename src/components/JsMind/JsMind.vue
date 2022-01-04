<template>
  <div :key='refresh'>
    <div id="jsmind_container"></div>
    <div style="display:none">
      <input class="file" type="file" id="image-chooser" accept="image/*" />
    </div>
  </div>
</template>

<script>
import "./jsmind.js";
import "./jsmind.css";
import './jsmind.draggable.js'
import './jsmind.screenshot.js'
import './jsmind.menu.js'
export default {
    name: "jsMind",
    props: {
      values: {
        type: Object,
        required: true
      },
      options: {
        type: Object
      },
      height: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        jm: {},
        refresh: 1,
        value: {},
        // 默认配置
        default_options: {
          container: "jsmind_container",
          editable: true, // 是否启用编辑
          theme: "hc", // 主题
          mode: "full", // 显示模式
          support_html: true, // 是否支持节点里的HTML元素
          view: {
            engine: "canvas", // 思维导图各节点之间线条的绘制引擎
            hmargin: 100, // 思维导图距容器外框的最小水平距离
            vmargin: 50, // 思维导图距容器外框的最小垂直距离
            line_width: 2, // 思维导图线条的粗细
            line_color: "#cecaca" // 思维导图线条的颜色
          },
          layout: {
            hspace: 30, // 节点之间的水平间距
            vspace: 20, // 节点之间的垂直间距
            pspace: 13 // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
          },
          shortcut: {
            enable: true, // 是否启用快捷键
            handles: {
              SavePNG() {
                this.jm.screenshot.shootDownload();
              }
            }, // 命名的快捷键事件处理器
            mapping: {
              // 快捷键映射
              left: 37, // <Left>
              up: 38, // <Up>
              right: 39, // <Right>
              down: 40, // <Down>
            }
          }
        }
      }
    },
    watch: {
      values: {
        handler() {
          this.$nextTick(() => {
            this.refresh++
            const options = Object.assign(this.default_options, this.options);
            this.jm = window.jsMind.show(options, this.value)
          })
        },
        deep: true
      },
    },
    methods: {
      init() {
        this.value = this.values
        const options = Object.assign(this.default_options, this.options);
        this.jm = window.jsMind.show(options, this.value)
      }
    },
    mounted() {
      this.init()
    },

    updated() {
      this.init()
    }
  };
</script> 

<style scoped>
  #jsmind_container {
    border: 1px dotted #ccc;
    height: 700px;
    overflow: hidden;
  }
</style>