// @vitest-environment happy-dom

import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import ComponentIcon from "@/components/Component/ComponentIcon.vue";

describe("ComponentIcon", () => {
  test(`ComponentIcon { props: { name: "loading" } }"`, () => {
    const wrapper = mount(ComponentIcon, { props: { name: "loading" } });
    expect(wrapper.find("svg.component_icon g circle animateTransform").exists()).toEqual(true);
  });
  test(`ComponentIcon { props: { name: "down", fill: "red" } }"`, () => {
    const wrapper = mount(ComponentIcon, { props: { name: "down", fill: "red" } });
    expect(wrapper.find("svg.component_icon").attributes("fill")).toEqual("red");
  });
});
