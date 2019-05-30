export default {
  'info-display': {
    title: '信息展示',
    list: [
      {
        name: 'AccountFeaturesXXX',
        image:
          'https://img.alicdn.com/tfs/TB18xuRGIbpK1RjSZFyXXX_qFXa-260-260.png',
        desc: '测试Account',
        appId: '28',
        id: '23',
        prodPubId: '103'
      },
      {
        name: 'AblityItems',
        image:
          'https://unpkg.com/@icedesign/not-permission-block/screenshot.png',
        desc: 'AblityItems1',
        appId: '28',
        id: '20',
        prodPubId: '85'
      },
      {
        name: 'AbilityIntroduction',
        image:
          'https://unpkg.com/@icedesign/not-permission-block/screenshot.png',
        desc: 'AbilityIntroduction',
        appId: '28',
        id: '19',
        prodPubId: '102'
      }
    ]
  }
};

export const blockSchema = {
  component: 'div',
  props: {
    className: 'hy-ability',
    style: { textAlign: 'center', background: '#fff', padding: '40px 0' }
  },
  children: [
    {
      component: 'div',
      props: {
        className: 'hy-ability-item',
        style: {
          display: 'inline-block',
          width: '360px',
          margin: '35px 0',
          verticalAlign: 'top'
        }
      },
      children: [
        {
          component: 'img',
          props: {
            alt: '',
            src:
              'https://img.alicdn.com/tfs/TB1voAtGr2pK1RjSZFsXXaNlXXa-108-128.svg',
            style: { height: '62px' }
          },
          children: []
        },
        {
          component: 'h3',
          props: {
            style: {
              fontSize: '20px',
              lineHeight: '26px',
              color: '#333',
              fontWeight: '400',
              margin: '18px 0 10px'
            },
            data_text: '能力输出'
          },
          children: []
        },
        {
          component: 'p',
          props: {
            style: { fontSize: '16px', color: '#999', lineHeight: '21px' },
            data_text: '支付、实名、信用、理财、大数据'
          },
          children: []
        }
      ]
    },
    {
      component: 'div',
      props: {
        className: 'hy-ability-item',
        style: {
          display: 'inline-block',
          width: '360px',
          margin: '35px 0',
          verticalAlign: 'top'
        }
      },
      children: [
        {
          component: 'img',
          props: {
            alt: '',
            src:
              'https://gw.alicdn.com/tfs/TB1DloSGxnaK1RjSZFBXXcW7VXa-91-113.svg',
            style: { height: '62px' }
          },
          children: []
        },
        {
          component: 'h3',
          props: {
            style: {
              fontSize: '20px',
              lineHeight: '26px',
              color: '#333',
              fontWeight: '400',
              margin: '18px 0 10px'
            },
            data_text: '政策扶持'
          },
          children: []
        },
        {
          component: 'p',
          props: {
            style: { fontSize: '16px', color: '#999', lineHeight: '21px' },
            data_text: '物料、返佣、品牌支持、运营收益'
          },
          children: []
        }
      ]
    },
    {
      component: 'div',
      props: {
        className: 'hy-ability-item',
        style: {
          display: 'inline-block',
          width: '360px',
          margin: '35px 0',
          verticalAlign: 'top'
        }
      },
      children: [
        {
          component: 'img',
          props: {
            alt: '',
            src:
              'https://gw.alicdn.com/tfs/TB104ktGrvpK1RjSZFqXXcXUVXa-122-118.svg',
            style: { height: '62px' }
          },
          children: []
        },
        {
          component: 'h3',
          props: {
            style: {
              fontSize: '20px',
              lineHeight: '26px',
              color: '#333',
              fontWeight: '400',
              margin: '18px 0 10px'
            },
            data_text: '资源整合'
          },
          children: []
        },
        {
          component: 'p',
          props: {
            style: { fontSize: '16px', color: '#999', lineHeight: '21px' },
            data_text: '门禁停车、智能家居、生活服务'
          },
          children: []
        }
      ]
    }
  ]
};
