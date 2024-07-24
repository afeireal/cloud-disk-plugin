// @vitest-environment happy-dom

import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import ComponentRadio from "@/components/Component/ComponentRadio.vue";

describe("ComponentRadio", () => {
  test(`ComponentRadio setValue "label"`, async () => {
    const wrapper: any = mount(ComponentRadio, {
      props: {
        label: "label",
        "onUpdate:modelValue": (val) => wrapper.setProps({ modelValue: val }),
      },
    });
    await wrapper.find("input.component-radio-input-original").setValue("label");
    expect(wrapper.props("modelValue")).toEqual("label");
  });
});
