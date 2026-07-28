import { mock as bunMock } from "bun:test";

type LooseMockFactory = {
  <T extends (...args: any[]) => any>(implementation?: T): any;
  module: typeof bunMock.module;
  restore: typeof bunMock.restore;
};

export const mock = bunMock as LooseMockFactory;
