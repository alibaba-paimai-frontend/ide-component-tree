export default {
  component: {
    packageId: 134,
    name: 'Grid.Row'
  },
  children: [
    {
      component: {
        packageId: 134,
        name: 'Grid.Col'
      },
      props: {
        style: {
          marginBottom: ' 20px'
        }
      },
      children: [
        {
          component: {
            packageId: 134,
            name: 'Breadcrumb'
          },
          children: [
            {
              component: {
                packageId: 134,
                name: 'Breadcrumb.Item'
              },
              props: {
                link: '',
                data_text: '选品平台'
              },
              children: []
            },
            {
              component: {
                packageId: 134,
                name: 'Breadcrumb.Item'
              },
              props: {
                data_text: '选商品',
                link: ''
              },
              children: []
            }
          ]
        }
      ]
    },
    {
      component: {
        packageId: 134,
        name: 'Button'
      },
      props: {
        children: '{{$scope.text}}',
        onClick: '{{$button1_onClick}}'
      }
    }
  ]
};
