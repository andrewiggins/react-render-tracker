import React from "./react";
import testCases from "./cases/index";
import createTestCaseWrapper from "./create-test-case-wrapper";
import { createElement } from "./dom-utils";

function createTocItem(id: string | undefined, title: string) {
  return createElement("li", null, [
    createElement("a", { href: `#${id || ""}` }, title),
  ]);
}

Promise.all(testCases).then(testCases => {
  const testCaseWrappers = testCases.map(test => createTestCaseWrapper(test));

  const sidebarEl: HTMLElement = document.querySelector(".playground__sidebar");
  const contentEl: HTMLElement = document.querySelector(".playground__content");
  const tocEl = sidebarEl.appendChild(
    createElement("ul", "playground__toc", [createTocItem(undefined, "All")])
  );

  for (const testCaseWrapper of testCaseWrappers) {
    const { id, testcase } = testCaseWrapper;

    tocEl.append(createTocItem(id, testcase.title));
  }

  let selectedTestCaseId = null;
  const renderedTestCases = new Set<ReturnType<typeof createTestCaseWrapper>>();
  const syncSelectedTestCase = () => {
    const newSelectedTestCaseId = location.hash.slice(1) || null;
    const newSelectedHash = `#${newSelectedTestCaseId || ""}`;

    for (const link of tocEl.querySelectorAll("a[href]")) {
      link.classList.toggle(
        "selected",
        link.getAttribute("href") === newSelectedHash
      );
    }

    for (const testCaseWrapper of renderedTestCases) {
      renderedTestCases.delete(testCaseWrapper);
      testCaseWrapper.dispose();
    }

    selectedTestCaseId = newSelectedTestCaseId;

    for (const testCaseWrapper of testCaseWrappers) {
      const { id, render, testcase } = testCaseWrapper;
      const { Root, title } = testcase;

      if (selectedTestCaseId !== null && selectedTestCaseId !== id) {
        continue;
      }

      renderedTestCases.add(testCaseWrapper);
      render(contentEl, <Root title={title} />);
    }
  };

  syncSelectedTestCase();
  addEventListener("hashchange", syncSelectedTestCase);
});
