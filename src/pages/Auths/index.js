import React, { useEffect, useState } from "react";
import {
  Card,
  Breadcrumb,
  Layout,
  Table,
  Space,
  Form,
  Row,
  Col,
  Button,
  Input,
  Modal,
  Tabs,
  Radio,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  getAuthList,
  editAuth,
  addAuth,
  // getStatusList,
} from "../../api/auth/index";
import { PlusOutlined } from "@ant-design/icons";
const { Content } = Layout;
const { TabPane } = Tabs;
const statusLists = [
  {
    action: "query",
    name: "查询列表",
    describe: "查询列表",
  },
  {
    action: "get",
    name: "查询明细",
    describe: "查询明细",
  },
  {
    action: "add",
    name: "新增",
    describe: "新增",
  },
  {
    action: "update",
    name: "修改",
    describe: "修改",
  },
  {
    action: "delete",
    name: "删除",
    describe: "删除",
  },
  {
    action: "import",
    name: "导入",
    describe: "导入",
  },
  {
    action: "export",
    name: "导出",
    describe: "导出",
  },
];
function NewService1() {
  //初始化数据
  useEffect(() => {
    const result = getAuthList();
    setSerchDataSource(result);
    setStatusList(statusLists);
  }, []);
  //获取表单元素
  const [form] = Form.useForm();
  const [form_status] = Form.useForm();
  const [form_all_states] = Form.useForm();
  //设置搜索表格数据状态
  const [serchDataSource, setSerchDataSource] = useState();
  //权限原始数据
  const [dataSource, setDataSource] = useState(getAuthList());
  //status数据
  const [statusList, setStatusList] = useState();
  //设置模态框显示状态
  const [ModalVisible, setModalVisible] = useState(false);
  //设置新增权限的可编辑性
  const [addNewState, setAddNewState] = useState(false);
  //编辑权限的列表
  const [editableAuths, setEdiTableAuths] = useState([]);
  //是否是编辑权限
  const [eidtState, setEditState] = useState(false);
  //编辑需要拿到原来的id
  const [newID, setNewID] = useState();
  //权限列表
  const columns = [
    {
      title: "ID",
      id: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名称",
      id: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "状态",
      id: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return text === 0 ? "禁用" : "启用";
      },
    },
    {
      title: "操作",
      key: "actions",
      render: (record) => (
        //外表格编辑事件
        <Space size="middle" key="action">
          <a
            onClick={() => {
              setNewID(record.id);
              setEditState(true);
              setEdiTableAuths(record.actions);
              form_all_states.setFieldsValue({
                ...record,
              });
              setModalVisible(true);
            }}
          >
            编辑
          </a>
          <a onClick={() => deleteData(record)}>删除</a>
        </Space>
      ),
    },
  ];
  //******************************************************************************* */
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.action === editingKey;
  //权限表格
  const statusColums = [
    {
      title: "操作类型",
      id: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      editable: true,
    },
    {
      title: "名称",
      id: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      editable: true,
    },
    {
      title: "描述",
      id: "Describe",
      dataIndex: "describe",
      key: "describe",
      align: "center",
      editable: true,
    },
    {
      title: () => {
        return (
          <span>
            {"操作"}
            <span
              className="operation"
              style={{ fontWeight: "100", color: "#A5A5A5" }}
            >
              丨
            </span>
            <PlusOutlined
              onClick={() => {
                setAddNewState(true);
                //(addNewState:true)如果已经点过新增了，则点击事件无效
                if (!addNewState) {
                  //生成一行空的新数据
                  const newLiist = {
                    action: "",
                    name: "",
                    describe: "",
                  };
                  if (eidtState) {
                    const newEdiData = [...editableAuths];
                    newEdiData.unshift(newLiist);
                    setEdiTableAuths(newEdiData);
                    form_status.setFieldsValue({
                      ...newLiist,
                    });
                    //新增后设置为true
                    //setIsAddCancel(true);
                  } else {
                    const newData = [...statusList];
                    newData.unshift(newLiist);
                    setStatusList(newData);
                    form_status.setFieldsValue({
                      ...newLiist,
                    });
                    //新增后设置为true
                    //setIsAddCancel(true);
                  }
                }
              }}
            />
          </span>
        );
      },
      key: "actions",
      render: (_, record, index) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(index)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Typography.Link>
            <Popconfirm
              title="确定要取消?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                //清除权限列表中的空数据
                clearNullData();
              }}
            >
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              style={{ marginRight: 16 }}
              disabled={addNewState ? true : editingKey !== ""}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>
            <Typography.Link
              // 点击了新增，则编辑和删除不可用状态
              disabled={addNewState ? true : editingKey !== ""}
              onClick={() => delStatusList(index)}
            >
              删除
            </Typography.Link>
          </span>
        );
      },
    },
  ];
  const edit = (record) => {
    form_status.setFieldsValue({
      ...record,
    });
    setEditingKey(record.action);
  };
  const cancel = () => {
    //设置新增禁用为false
    setAddNewState(false);
    setEditingKey("");
  };
    const clearNullData=()=>{
      // 如果编辑状态为true，则清空 编辑权限 列表的空白列，否则清除所有权限列表的
      if (eidtState) {
        console.log("cs编辑");
        const newData = editableAuths.filter((item) => {
          return (
            item.action !== "" &&
            item.name !== "" &&
            item.describe !== ""
          );
        });
        setEdiTableAuths(newData);
      } else {
        console.log("cs新键");
        const newData = statusList.filter((item) => {
          return (
            item.action !== "" &&
            item.name !== "" &&
            item.describe !== ""
          );
        });
        setStatusList(newData);
      }
      cancel();
    }
  const save = async (index) => {
    //保存数据,编辑状态为true就走保存编辑，否则走新建。
    if (eidtState) {
      const row = await form_status.validateFields();
      console.log("sv编辑");
      const editData = [...editableAuths];
      const item = editData[index];
      editData.splice(index, 1, { ...item, ...row });
      setEdiTableAuths(editData);
      console.log(editData);
    } else {
      const row = await form_status.validateFields();
      console.log("sv新键");
      const addData = [...statusList];
      const item = addData[index];
      addData.splice(index, 1, { ...item, ...row });
      setStatusList(addData);
      console.log(addData);
    }
    cancel();
  };
  //删除权限
  const delStatusList = (index) => {
    if (eidtState) {
      const newData = [...editableAuths];
      newData.splice(index, 1);
      setEdiTableAuths(newData);
    } else {
      const newData = [...statusList];
      newData.splice(index, 1);
      setStatusList(newData);
    }
    cancel();
  };
  //编辑表格
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
          >
            <Input style={{ width: 100 }} />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const mergedColumns = statusColums.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  //************************************************************************************ */
  //********删除事件
  const deleteData = (render) => {
    //删除搜索结果里的对应数据
    const newDataSource_s = serchDataSource.filter((item) => {
      return render.id !== item.id;
    });
    //更改状态，渲染当前表格
    setSerchDataSource(newDataSource_s);
    //删除总数据里对应数据
    const newDataSource_d = dataSource.filter((item) => {
      return render.id !== item.id;
    });
    //更改状态，渲染表格
    setDataSource(newDataSource_d);
  };

  //********搜索事件
  const serchData = (formDta) => {
    //筛选数据
    const newDataSource = dataSource.filter((item) => {
      return (
        item.id.indexOf(formDta.id === undefined ? "" : formDta.id) > -1 &&
        item.name.indexOf(formDta.name === undefined ? "" : formDta.name) > -1
      );
    });
    //更改状态，渲染表格
    setSerchDataSource(newDataSource);
  };
  /*****************新建权限的所有表单事件 */
  const addAllStatus = (values) => {
    if (eidtState) {
      const newData = {
        id: values.id,
        name: values.name,
        status: values.status,
        actions: editableAuths,
      };
      editAuth(newID, newData);
      let newArr = [...dataSource];
      setSerchDataSource(newArr);
      console.log("xin");
      console.log(newArr);
      message.success("编辑成功！");
      //执行清除空数据
      clearNullData();
      //清空表单
      form_all_states.resetFields();
      //设置编辑状态为false
      setEditState(false);
      //关闭模态框
      setModalVisible(false);
    } else {
      const newData = {
        id: values.id,
        name: values.name,
        status: values.status,
        actions: statusList,
      };
      addAuth(newData);
      let newArr = [...dataSource];
      setSerchDataSource(newArr);
      form_all_states.resetFields();
      message.success("添加成功！");
      setModalVisible(false);
    }
  };
  return (
    <Card>
      <Breadcrumb separator=">">
        <Breadcrumb.Item href="/services">角色管理</Breadcrumb.Item>
        <Breadcrumb.Item href="/services/1">权限管理</Breadcrumb.Item>
      </Breadcrumb>

      <Content style={{ margin: "15px 0" }}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Form form={form} onFinish={(valus) => serchData(valus)}>
            <Row justify="space-around">
              <Col span={7}>
                <Form.Item name="id" label="ID">
                  <Input placeholder="请输入ID" />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name="name" label="名称">
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Row justify="end">
                  <Col>
                    <Form.Item>
                      <Space direction="inline" size="middle">
                        <Button type="primary" onClick={() => form.submit()}>
                          查询
                        </Button>
                        <Button
                          onClick={() => {
                            form.resetFields();
                            setSerchDataSource(dataSource);
                          }}
                        >
                          重置
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          {/* 新建权限 */}
          <Button
            type="primary"
            onClick={() => {
              //点击新建设置编辑为false
              setEditState(false);
              //打开模态框
              setModalVisible(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>
          <Modal
            title={eidtState ? "编辑权限" : "新建权限"}
            width={800}
            style={{ top: 0 }}
            visible={ModalVisible}
            onOk={() => 
            {
              form_all_states.submit()
              clearNullData();
            }}
            onCancel={() => {
              form_all_states.resetFields();
              //设置当前状态为编辑(true)或新建(false)
              setEditState(false);
              clearNullData();
              setModalVisible(false);
              
            }}
            okText="确定"
            cancelText="取消"
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Form
                  form={form_all_states}
                  onFinish={addAllStatus}
                  labelAlign="right"
                >
                  <Row justify="start">
                    <Col span={12}>
                      <Form.Item
                        label="权限标识 (ID)"
                        labelCol={{ span: 8 }}
                        name="id"
                        colon={true}
                        rules={[{ required: true, message: "该项必填" }]}
                      >
                        <Input placeholder="只能由数字字母下划线组成" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="权限名称"
                        labelCol={{ span: 8 }}
                        name="name"
                        colon={true}
                        rules={[{ required: true, message: "该项必填" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="状态"
                        labelCol={{ span: 8 }}
                        colon={true}
                        name="status"
                        rules={[{ required: true, message: "该项必选" }]}
                      >
                        <Radio.Group buttonStyle="solid">
                          <Radio.Button value={0}>禁用</Radio.Button>
                          <Radio.Button value={1}>启用</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      {/* 权限表格 */}
                      <Form form={form_status} component={false}>
                        <Table
                          size="small"
                          bordered={true}
                          columns={mergedColumns}
                          dataSource={eidtState ? editableAuths : statusList}
                          rowKey={(record) => {
                            return record.action;
                          }}
                          components={{
                            body: {
                              cell: EditableCell,
                            },
                          }}
                          pagination={{
                            onChange: cancel,
                          }}
                        />
                      </Form>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
            </Tabs>
          </Modal>
          {/* 数据表格 */}
          <Table
            columns={columns}
            dataSource={serchDataSource}
            rowKey={(record) => {
              return record.id;
            }}
          />
        </Space>
      </Content>
    </Card>
  );
}

export default NewService1;
