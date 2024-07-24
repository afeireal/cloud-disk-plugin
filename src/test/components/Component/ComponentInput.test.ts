// @vitest-environment happy-dom

import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import ComponentInput from "@/components/Component/ComponentInput.vue";

describe("ComponentInput", () => {
  test(`ComponentInput setValue "Hello, World!"`, async () => {
    const wrapper: any = mount(ComponentInput, {
      props: {
        type: "input",
        label: "label",
        "onUpdate:modelValue": (val) => wrapper.setProps({ modelValue: val }),
      },
    });
    await wrapper.find("input.component-input-input").setValue("Hello, World!");
    expect(wrapper.props("modelValue")).toEqual("Hello, World!");
  });
});
