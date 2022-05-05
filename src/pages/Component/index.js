import React, { useState, useEffect } from "react";
import {
  Card,
  Breadcrumb,
  Layout,
  Switch,
  Divider,
  Input,
  Row,
  Col,
  Drawer,
  Form,
  Select,
  Radio,
  Button,
  Tag,
  Tooltip,
  Popconfirm,
  message,
} from "antd";
import { EditOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getComponentList,
  getComponentType,
  addComponent,
  editComponent,
  deleteComponent,
} from "../../api/component/index";
import "./index.css";

const { Content } = Layout;
const Option = Select.Option;
const { CheckableTag } = Tag;
//console.log(getComponentType());
// 获取所有组件类型
const componengtType = getComponentType();
//const componentLists =  getComponentList();

function Home() {
  //获取到表单元素
  const [form] = Form.useForm();
  //新增组件状态(打开模态框)
  const [drawerVisible, setDrawerVisible] = useState(false);
  //原始组件列表状态
  const [componentList, setComponentList] = useState([]);
  //组件筛选列表状态
  const [List, setList] = useState([]);
  //组件搜索列表状态
  const [serchList, setSerchList] = useState([]);
  //全选状态
  const [allTypeState, setAllTypeState] = useState(true);
  //标签栏状态
  const [selectedTags, setSelectedTags] = useState([]);
  //设置是否禁用,编辑或新增组件
  const [disable, setDisable] = useState(false);
  //更新状态，渲染页面
  const [, setUpdate] = useState({});

  //********新增或者编辑组件事件 */
  const AddComponent = (valus) => {
    console.log(valus);
    //创建一个对象,存放需要新增的组件
    const newComponent = {
      id: new Date().getTime(), //获取当前时间戳显示为毫秒(作为组件ID)
      name: valus.name,
      type: valus.type,
      state: {
        text: "已启动",
        value: "enabled",
      },
    };
    //判断是新增(false)还是编辑(true)操作
    if (disable) {
      editComponent(valus.id, valus);
    } else {
      addComponent(newComponent);
      //创建新数组，取出当前List(进行了数据筛选操作)数据
      let newList = [].concat(List);
      //将新增的组件添加到新数组
      newList.push(newComponent);
      //如果新增操作是在'全部'标签下进行的，则设置List为空，渲染原始数据
      allTypeState ? setList([]) : setList(newList);
    }
    //修改或新增完毕，提示文本
    message.success(disable ? "编辑组件成功！" : "新增组件成功！");
    //表单清空，抽屉关闭
    form.resetFields();
    setDrawerVisible(false);
  };

  //*******初始数据抓取
  useEffect(() => {
    const result = getComponentList();
    setComponentList(result);
  }, []);

  //*******表单赋值事件
  const setDrawerValues = (itemes) => {
    if (itemes !== undefined) {
      form.setFieldsValue({
        id: itemes.id,
        name: itemes.name,
        type: itemes.type,
        shareCluster: itemes.shareCluster ? 1 : 2,
        state: itemes.state,
      });
    }
    //表单清空
    // form.setFieldsValue(formValues);
    setDisable(itemes === undefined ? false : true);
    setDrawerVisible(true);
  };

  return (
    <>
      <Drawer
        title={disable ? "编辑网络组件" : "新增网络组件"}
        visible={drawerVisible}
        width={520}
        closable={false}
        extra={
          <CloseOutlined
            onClick={() => {
              //表单清空，抽屉关闭
              form.resetFields();
              setDrawerVisible(false);
            }}
          />
        }
        footer={
          <Row justify="end">
            <Col span={4}>
              <Button
                onClick={() => {
                  //表单清空，抽屉关闭
                  form.resetFields();
                  setDrawerVisible(false);
                }}
              >
                取消
              </Button>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                onClick={() => {
                  //提交表单
                  form.submit();
                }}
              >
                保存
              </Button>
            </Col>
          </Row>
        }
      >
        <Form
          labelCol={{ span: 5 }}
          labelAlign="left"
          colon={false}
          form={form}
          onFinish={(valus) => AddComponent(valus)}
        >
          <Form.Item hidden={true} name="id">
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "该项必填！" }]}
            label="组件名称"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            rules={[{ required: true, message: "该项必填！" }]}
            label="组件类型"
          >
            <Select disabled={disable}>
              {componengtType.map((item) => (
                <Option value={item.type} key={item.id}>
                  {item.id}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="集群"
            name="shareCluster"
            rules={[{ required: true, message: "该项必填！" }]}
          >
            <Radio.Group>
              <Radio value={1}>共享配置</Radio>
              <Radio value={2}>独立配置</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item hidden={true} name="state">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
      <Card>
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/home">角色管理</Breadcrumb.Item>
          <Breadcrumb.Item href="/home/1">组件管理</Breadcrumb.Item>
        </Breadcrumb>

        <Content style={{ margin: "15px 0" }}>
          <Row gutter={[20, 8]} align="middle">
            <Col>
              <span>组件类型：</span>
            </Col>
            <Col className="TypIteme-itemes">
              <CheckableTag
                checked={allTypeState}
                onClick={() => {
                  //设置【全选】选中
                  setAllTypeState(true);
                  //设置选中图标数组为空
                  setSelectedTags([]);
                  //设置筛选数组为空
                  setList([]);
                  //设置搜索数组为空
                  setSerchList([]);
                }}
              >
                全部
              </CheckableTag>
            </Col>
            {componengtType.map((item, index) => (
              <Col className="TypIteme-itemes" key={index}>
                <CheckableTag
                  key={index}
                  checked={
                    allTypeState ? false : selectedTags.indexOf(item.name) > -1
                  }
                  onChange={(checked) => {
                    //数据筛选核心代码
                    const nextSelectedTags = checked
                      ? [...selectedTags, item.name]
                      : selectedTags.filter((t) => t !== item.name);
                    setSelectedTags(nextSelectedTags);

                    //console.log("改变时" + selectedTags);

                    //现将List数据取出合并到新数组
                    const newdata = [].concat(List);
                    //如果选中当前标签，则取出标签的id和组件的type对比，相等则返回并push到新数组，然后更新渲染结构。
                    //如果未选中当前标签，则取出当前标签的id和组件type对比，剔除组件数组中相同类型的组件数据，
                    //(此步骤表示取消选中当前标签)，返回的新数组来更新渲染结果
                    checked
                      ? componentList
                          .filter((data) => {
                            return item.id === data.type;
                          })
                          .map((data_item) => newdata.push(data_item))
                      : setList(
                          newdata.filter((cutArr) => {
                            return cutArr.type !== item.id;
                          })
                        );

                    if (checked) {
                      setList(newdata);
                    }
                    //设置搜索数组为空
                    setSerchList([]);
                    //设置【全选】不选中
                    setAllTypeState(false);
                  }}
                >
                  {item.name}
                </CheckableTag>
              </Col>
            ))}
          </Row>
          <Divider dashed />
          <Row gutter={[20, 8]} align="middle">
            <Col>
              <span>其他选项：</span>
            </Col>
            <Col>
              <span className="TypIteme-itemes">组件类型：</span>
            </Col>
            <Col>
              <Input
                placeholder="输入空则显示全部数据"
                onPressEnter={(e) => {
                  setSerchList(
                    componentList.filter((item) => {
                      return item.name.indexOf(e.target.value) > -1;
                    })
                  );
                  e.target.value === ""
                    ? setAllTypeState(true)
                    : setAllTypeState(false);
                  //设置选中标签为空(用来清除筛选标签样式)
                  setSelectedTags([]);
                }}
              />
            </Col>
          </Row>
        </Content>
      </Card>
      <Content style={{ margin: "15px 0" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={6}>
            <Card
              className="componengt-Card  componengt-Card-add"
              onClick={() => {
                setDisable(false);
                setDrawerVisible(true);
              }}
            >
              <PlusOutlined /> 新增组件
            </Card>
          </Col>
          {/* 判断展示搜索列表，筛选列表，全部数据列表 */}
          {(serchList.length > 0
            ? serchList
            : allTypeState
            ? componentList
            : List
          ).map((item) => (
            <Col span={6} key={item.id}>
              <Card
                className="componengt-Card"
                actions={[
                  <EditOutlined onClick={() => setDrawerValues(item)} />,
                  <Popconfirm
                    title="确认删除次组件吗?"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => {
                      //删除组件方法
                      deleteComponent(item.id);
                      allTypeState
                        ? setList([])
                        : setList(
                            List.filter((data) => {
                              return item.id !== data.id;
                            })
                          );
                      setComponentList(getComponentList()); /*  */
                    }}
                  >
                    <CloseOutlined />
                  </Popconfirm>,
                ]}
              >
                <Row>
                  <Col>
                    <p className="card-text card-text-title">
                      <span className="other-choose"></span>
                      <Tooltip title={item.name}>{item.name}</Tooltip>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ textAlign: "center" }} span={12}>
                    <p className="card-text card-text-type">组件类型：</p>
                    <p className="card-text">{item.type}</p>
                  </Col>
                  <Col style={{ textAlign: "center" }} span={12}>
                    <p className="card-text card-text-type">启动状态：</p>
                    <p className="card-text">
                      <Popconfirm
                        title={
                          item.state.value === "enabled"
                            ? "确认关闭?"
                            : "确认启动?"
                        }
                        onConfirm={() => {
                          //设置开关状态
                          if (item.state.value === "enabled") {
                            item.state.value = "disabled";
                          } else if (item.state.value === "disabled") {
                            item.state.value = "enabled";
                          }
                          //更新状态
                          setUpdate({});
                        }}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Switch checked={item.state.value === "enabled"} />
                      </Popconfirm>
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </>
  );
}

export default Home;
