<script lang="ts">
import { h, defineComponent } from "vue";
import icons from "@/utils/icons";
import render from "@/utils/render";

export default defineComponent({
  name: "ComponentIcon",
  props: {
    name: {
      type: String,
      default: "",
    },
    fill: {
      type: String,
    },
  },
  setup(props, { attrs }) {
    return () => {
      const icon = icons[props.name];
      if (!icon) {
        return;
      }
      return h(
        icon.type,
        {
          ...icon.props,
          ...attrs,
          name: props.name,
          fill: props.fill || icon.props?.fill,
          class: "component_icon",
        },
        render(icon.children)
      );
    };
  },
});
</script>
<style scoped>
.component_icon {
  width: 1em;
  height: 1em;
  display: inline-block;
}
</style>
