// @vitest-environment happy-dom

import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import ComponentCheckbox from "@/components/Component/ComponentCheckbox.vue";

describe("ComponentCheckbox", () => {
  test(`ComponentCheckbox setValue true`, async () => {
    const wrapper: any = mount(ComponentCheckbox, {
      props: {
        label: "label",
        "onUpdate:modelValue": (val) => wrapper.setProps({ modelValue: val }),
      },
    });
    await wrapper.find("input.component-checkbox-input-original").setValue(true);
    expect(wrapper.props("modelValue")).toEqual(true);
  });
});
