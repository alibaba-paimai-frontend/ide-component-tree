# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.1.2"></a>
## [0.1.2](https://github.com/alibaba-paimai-frontend/ide-component-tree/compare/v0.0.2...v0.1.2) (2019-03-10)


### Bug Fixes

* **类型声明:** 使用显式类型声明，解决无法导出 ComponentTree/index.d.ts 的问题；给 based 传递 DEFAULT_PROPS 参数； ([7463bad](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/7463bad))
* **类型声明:** 解决无法导出 schema/index.d.ts 的问题，使用 IAnyModelType 类型 ([3d5b6b7](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/3d5b6b7))



<a name="0.0.2"></a>
## 0.0.2 (2019-03-08)


### Bug Fixes

* **bugfix:** store 初始化新增 create 操作 ([3c86942](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/3c86942))


### Features

* **代码风格:** 同步最新模板，使用 ide-lib-utils、ide-lib-base-component 组件改写；新增 .github 模板； ([83b6363](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/83b6363))
* **功能:** 使用工厂模式 + 中间件模式，提供创建上下文相互隔离的 MVC 模型的能力 ([1745cdf](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/1745cdf))
* **功能增强:** 支持子组件 store 复用；引入 ette-proxy，精简路由代码；同步最新的 webpack 打包配置； ([02632f8](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/02632f8))
* **功能增强:** 新增 component list 组件；使用 mobx-react-lite 编写函数式组件； ([79dc822](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/79dc822))
* **功能增强:** 新增右键上下文菜单功能；新增 store id；扩展组件的事件监听属性； ([72c038f](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/72c038f))
* **功能增强：storesEnv:** 引入 storesEnv 和 solutions 来缓解自定义事件 ([7abdb3b](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/7abdb3b))
* **功能完善:** 完善 schema 中针对 children 的更新、删除操作 ([3a82d11](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/3a82d11))
* **功能完善:** 新增对 list 列表的区域探测 ([16ee88d](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/16ee88d))
* **功能完善：基础交互:** 完成节点的右键面板中的增删改查操作，基本上已具备可使用状态 ([515a629](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/515a629))
* **功能改进:** 使用工厂模式 + 中间件模式，提供创建上下文相互隔离的 MVC 模型的能力 ([4dd2967](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/4dd2967))
* **功能改进:** 通过 typeof + instance 动态获取 model 的 ts 类型声明；初始化 jest 单元测试环境；初始化 storybook 环境； ([72adabf](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/72adabf))
* **功能新增:** 引入 ide-tree 和 ide-context-menu 组件，使用 mst 依赖注入子组件的 client 对象；webpack 打包输出支持 cmd + umd 两种方 ([fe25954](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/fe25954))
* **新增 api:** 新增 put/del 两组 api 用于更新节点信息、删除节点 ([a3d381c](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/a3d381c))
* **树节点选择:** 新增 autoExpandIdIntoView 方法，能够精细控制节点出现在视图中（类似于 autoExpandParent） ([6719c38](https://github.com/alibaba-paimai-frontend/ide-component-tree/commit/6719c38))
