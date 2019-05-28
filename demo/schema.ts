export default {
  component: {
    packageId: 134,
    name: 'Grid.Row'
  },
  id: '$Row_B1wLZ',
  uuid: '$uu_Row_BJeaC',
  children: [
    {
      component: {
        packageId: 134,
        name: 'Grid.Col'
      },
      id: '$Col_HJlwL',
      props: {
        style: {
          marginBottom: ' 20px'
        }
      },
      uuid: '$uu_Col_ByP6C',
      children: [
        {
          component: {
            packageId: 134,
            name: 'Breadcrumb'
          },
          id: '$Breadcrumb_HymdZ',
          uuid: '$uu_Breadcrumb_B1apC',
          children: [
            {
              component: {
                packageId: 134,
                name: 'Breadcrumb.Item'
              },
              id: '$BreadcrumbItem_B1qdb',
              props: {
                link: '',
                data_text: '选品平台'
              },
              uuid: '$uu_BreadcrumbItem_BJLgT',
              children: []
            },
            {
              component: {
                packageId: 134,
                name: 'Breadcrumb.Item'
              },
              id: '$BreadcrumbItem_SJVgf',
              props: {
                data_text: '选商品',
                link: ''
              },
              uuid: '$uu_BreadcrumbItem_Syve6',
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
      id: '$button1',
      props: {
        children: '{{$scope.text}}',
        onClick: '{{$button1_onClick}}'
      }
    }
  ]
};
