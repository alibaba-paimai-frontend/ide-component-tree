const COMMON_EXTERNALS = {
  ette: {
    commonjs: 'ette',
    commonjs2: 'ette',
    amd: 'ette',
    root: 'Ette'
  },
  'ette-router': {
    commonjs: 'ette-router',
    commonjs2: 'ette-router',
    amd: 'ette-router',
    root: 'etteRouter'
  },
  'ette-proxy': {
    commonjs: 'ette-proxy',
    commonjs2: 'ette-proxy',
    amd: 'ette-proxy',
    root: 'etteProxy'
  },
  react: {
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'react',
    root: 'React'
  },
  'react-dom': {
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    amd: 'react-dom',
    root: 'ReactDOM'
  },
  antd: 'antd',
  mobx: 'mobx',
  'mobx-react': {
    commonjs: 'mobx-react',
    commonjs2: 'mobx-react',
    amd: 'mobx-react',
    root: 'mobxReact'
  },
  'mobx-react-lite': {
    commonjs: 'mobx-react-lite',
    commonjs2: 'mobx-react-lite',
    amd: 'mobx-react-lite',
    root: 'mobxReact'
  },
  'mobx-state-tree': {
    commonjs: 'mobx-state-tree',
    commonjs2: 'mobx-state-tree',
    amd: 'mobx-state-tree',
    root: 'mobxStateTree'
  },
  'ss-tree': {
    commonjs: 'ss-tree',
    commonjs2: 'ss-tree',
    amd: 'ss-tree',
    root: 'ssTree'
  },
  'styled-components': {
    commonjs: 'styled-components',
    commonjs2: 'styled-components',
    amd: 'styled-components',
    root: 'styled'
  }
};


const COMMON_LIBS = Object.keys(COMMON_EXTERNALS);

module.exports = {
  COMMON_EXTERNALS,
  getExternal: function(extraLibs = [], useDirectName = false) {
    const libs = COMMON_LIBS.concat(extraLibs);
    const externals = {};
    libs.forEach(lib => {
      externals[lib] = useDirectName
        ? lib
        : (COMMON_EXTERNALS[lib] && COMMON_EXTERNALS[lib].root) || lib;
    });
    return externals;
  }
};
