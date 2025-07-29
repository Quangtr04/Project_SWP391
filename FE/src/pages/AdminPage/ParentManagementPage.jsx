"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Popconfirm,
  Card,
  Select,
  DatePicker,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  Empty,
  Typography,
} from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";
import { FaUserFriends, FaChild } from "react-icons/fa";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearAdminError,
  createStudent,
} from "../../redux/admin/adminSlice";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

// Modern theme configuration
const modernTheme = {
  colors: {
    primary: "#1677ff",
    secondary: "#722ed1",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
    info: "#13c2c2",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    cardBackground: "rgba(255, 255, 255, 0.95)",
    glassMorphism: "rgba(255, 255, 255, 0.25)",
    parentTheme: {
      primary: "#1677ff",
      secondary: "#4096ff",
      light: "#f0f9ff",
      gradient: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
    },
  },
  shadows: {
    card: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    hover: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    glow: "0 0 20px rgba(22, 119, 255, 0.3)",
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
  animations: {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    smooth: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

// Enhanced card styles
const modernCardStyle = {
  borderRadius: modernTheme.borderRadius.xl,
  background: modernTheme.colors.cardBackground,
  boxShadow: modernTheme.shadows.card,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(20px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  marginTop: "12px",
};

const gradientHeaderStyle = {
  background: modernTheme.colors.parentTheme.gradient,
  borderRadius: modernTheme.borderRadius.xl,
  padding: "40px",
  color: "white",
  marginBottom: "32px",
  boxShadow: modernTheme.shadows.glow,
  position: "relative",
  overflow: "hidden",
};

// Enhanced Statistics Card Component
const StatisticsCard = ({
  title,
  value,
  subValue,
  icon: IconComponent,
  color,
  trend,
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    transition={modernTheme.animations.spring}
  >
    <Card
      style={{
        ...modernCardStyle,
        background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
        borderLeft: `4px solid ${color}`,
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Text style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
            {title}
          </Text>
          <div className="flex items-baseline gap-2 mt-2">
            <Title
              level={2}
              style={{ margin: 0, color: "#1e293b", fontWeight: 700 }}
            >
              {value}
            </Title>
            {subValue && (
              <Text style={{ color: "#94a3b8", fontSize: "16px" }}>
                / {subValue}
              </Text>
            )}
          </div>
        </div>
        <div
          style={{
            backgroundColor: color,
            borderRadius: modernTheme.borderRadius.lg,
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 16px ${color}40`,
          }}
        >
          <IconComponent style={{ fontSize: "28px", color: "white" }} />
        </div>
      </div>
    </Card>
  </motion.div>
);

// Enhanced Page Header Component
const ParentPageHeader = ({ title, description, icon, statistics = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={modernTheme.animations.smooth}
    >
      <Card style={gradientHeaderStyle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {icon && (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                style={{
                  padding: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: modernTheme.borderRadius.full,
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {React.cloneElement(icon, {
                  style: { fontSize: "48px", color: "white" },
                })}
              </motion.div>
            )}
            <div>
              <Title
                level={1}
                style={{
                  color: "white",
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "36px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {title}
              </Title>
              {description && (
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "18px",
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>👨‍👩‍👧‍👦</span> {description}
                </Text>
              )}
            </div>
          </div>

          {/* Floating decoration */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              right: "40px",
              top: "20px",
              opacity: 0.1,
              fontSize: "120px",
              color: "white",
            }}
          >
            <FaUserFriends />
          </motion.div>
        </div>
      </Card>

      {/* Statistics Grid */}
      {statistics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...modernTheme.animations.smooth, delay: 0.2 }}
          style={{ marginTop: "32px" }}
        >
          <Row gutter={[24, 24]}>
            {statistics.map((stat, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <StatisticsCard {...stat} />
              </Col>
            ))}
          </Row>
        </motion.div>
      )}
    </motion.div>
  );
};

// Enhanced Filter Bar Component
const FilterBar = ({
  searchText,
  onSearchChange,
  onAddParent,
  onRefresh,
  isSubmitting,
  totalCount,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ ...modernTheme.animations.smooth, delay: 0.3 }}
  >
    <Card style={modernCardStyle}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Input
            placeholder="Tìm kiếm phụ huynh theo tên, email, số điện thoại..."
            prefix={<SearchOutlined style={{ color: "#64748b" }} />}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              height: "48px",
              borderRadius: modernTheme.borderRadius.lg,
              border: "2px solid #f1f5f9",
              fontSize: "14px",
            }}
            allowClear
          />
        </Col>

        <Col>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Text
              style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}
            >
              Tổng cộng:{" "}
              <strong style={{ color: "#1e293b" }}>{totalCount}</strong> phụ
              huynh
            </Text>

            <Space size="middle">
              <Tooltip title="Làm mới dữ liệu">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                  style={{
                    height: "40px",
                    borderRadius: modernTheme.borderRadius.md,
                    border: "1px solid #e2e8f0",
                  }}
                />
              </Tooltip>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddParent}
                disabled={isSubmitting}
                style={{
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: modernTheme.borderRadius.lg,
                  background: modernTheme.colors.parentTheme.gradient,
                  border: "none",
                  boxShadow: modernTheme.shadows.glow,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Thêm Phụ huynh mới
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  </motion.div>
);

export default function ParentManagementPage() {
  const dispatch = useDispatch();
  const {
    users: parents = [],
    loading,
    error,
  } = useSelector((state) => state.admin);
  const children = useSelector((state) => state.studentRecord.healthRecords);

  // Generate new student code
  const lastStudentCode =
    children.length > 0 ? children[children.length - 1].student_code : "STU000";
  const numericPart = Number.parseInt(lastStudentCode.replace("STU", ""), 10);
  const nextCodeNumber = numericPart + 1;
  const newStudentCode = `STU${nextCodeNumber.toString().padStart(3, "0")}`;

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [addStudentForParentForm] = Form.useForm();
  const [modalAddStudentForParent, setModalAddStudentForParent] =
    useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  const CURRENT_ROLE_INFO = {
    id: 4,
    name: "Phụ huynh",
    path: "parents",
    tagColor: "purple",
    endpoint: "/admin/parents",
  };

  // Enhanced statistics with trends
  const pageStatistics = [
    {
      title: "Tổng số phụ huynh",
      value: parents.length,
      icon: FaUserFriends,
      color: modernTheme.colors.parentTheme.primary,
      trend: 15,
    },
    {
      title: "Đang hoạt động",
      value: parents.filter((p) => p.is_active).length,
      icon: CheckCircleOutlined,
      color: modernTheme.colors.success,
      trend: 8,
    },
    {
      title: "Tạm ngưng",
      value: parents.filter((p) => !p.is_active).length,
      icon: CloseCircleOutlined,
      color: modernTheme.colors.error,
      trend: -3,
    },
  ];

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
    }, 300),
    []
  );

  const handleSearchChange = (value) => {
    debouncedSearch(value);
  };

  const fetchParentsData = useCallback(async () => {
    dispatch(
      fetchUsers({
        endpointPath: CURRENT_ROLE_INFO.endpoint,
        params: { search: searchText },
      })
    );
  }, [dispatch, searchText]);

  useEffect(() => {
    fetchParentsData();
  }, [fetchParentsData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  const handleAddParent = () => {
    setEditingParent(null);
    form.resetFields();
    form.setFieldsValue({
      status: true,
      gender: undefined,
    });
    setIsModalVisible(true);
  };

  const handleEditParent = (record) => {
    setEditingParent(record);
    form.setFieldsValue({
      ...record,
      status: record.is_active ? true : false,
      dayofbirth: record.dayOfBirth ? dayjs(record.dayOfBirth) : null,
    });
    setIsModalVisible(true);
  };

  const handleDeleteParent = (userId) => {
    setIsSubmitting(true);
    dispatch(
      deleteUser({ endpointPath: CURRENT_ROLE_INFO.endpoint, id: userId })
    )
      .unwrap()
      .then(() => {
        toast.success("Đã xóa tài khoản Phụ huynh thành công!");
        fetchParentsData();
      })
      .catch((error) => {
        toast.error(error?.message || "Xóa tài khoản thất bại!");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleAddStudentForParent = (parentRecord) => {
    setModalAddStudentForParent(true);
    setSelectedParent(parentRecord);
  };

  const handleFormSubmit = (values) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
      is_active: values.status ? true : false,
      dayofbirth: values.dayofbirth
        ? dayjs(values.dayofbirth).format("YYYY-MM-DD")
        : null,
    };

    if (editingParent) {
      dispatch(
        updateUser({
          endpointPath: "/admin/parents",
          user_id: editingParent.user_id,
          userData: payload,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Cập nhật tài khoản Phụ huynh thành công!");
          setIsModalVisible(false);
          form.resetFields();
          fetchParentsData();
        })
        .catch((error) => {
          toast.error(error?.message || "Cập nhật thất bại");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      dispatch(
        createUser({
          endpointPath: "/admin/register",
          userData: {
            ...payload,
            role_id: CURRENT_ROLE_INFO.id,
            role_name: "Parent",
          },
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Thêm tài khoản Phụ huynh thành công!");
          setIsModalVisible(false);
          form.resetFields();
          fetchParentsData();
        })
        .catch((error) => {
          toast.error(error?.message || "Thêm tài khoản thất bại");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleSubmitAddStudentForParentForm = (values) => {
    const payload = {
      ...values,
      parent_id: selectedParent?.user_id,
      day_of_birth: values.day_of_birth.format("YYYY-MM-DD"),
    };
    dispatch(createStudent(payload))
      .unwrap()
      .then(() => {
        toast.success("Thêm học sinh thành công!");
        setModalAddStudentForParent(false);
        setSelectedParent(null);
        addStudentForParentForm.resetFields();
      })
      .catch(() => {
        toast.error("Thêm học sinh thất bại!");
      });
  };

  const filteredParents = parents.filter((parent) =>
    Object.values(parent).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Enhanced table columns
  const columns = [
    {
      title: "Thông tin phụ huynh",
      key: "parentInfo",
      width: 280,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: modernTheme.colors.parentTheme.primary,
              fontSize: "18px",
              fontWeight: 600,
            }}
            icon={<UserOutlined />}
          >
            {record.fullname?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Text
              strong
              style={{ fontSize: "15px", color: "#1e293b", display: "block" }}
            >
              {record.fullname}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <MailOutlined style={{ color: "#64748b", fontSize: "12px" }} />
              <Text style={{ color: "#64748b", fontSize: "13px" }}>
                {record.email}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "2px",
              }}
            >
              <PhoneOutlined style={{ color: "#64748b", fontSize: "12px" }} />
              <Text style={{ color: "#64748b", fontSize: "13px" }}>
                {record.phone}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 140,
      render: (is_active) => (
        <Badge
          status={is_active ? "success" : "error"}
          text={
            <span
              style={{
                color: is_active
                  ? modernTheme.colors.success
                  : modernTheme.colors.error,
                fontWeight: 500,
                fontSize: "13px",
              }}
            >
              {is_active ? "Hoạt động" : "Tạm ngưng"}
            </span>
          }
        />
      ),
    },
    {
      title: "Thông tin cá nhân",
      key: "personalInfo",
      width: 200,
      render: (_, record) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <HomeOutlined style={{ color: "#64748b", fontSize: "12px" }} />
            <Text style={{ color: "#374151", fontSize: "13px" }}>
              {record.address || "Chưa cập nhật"}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#64748b", fontSize: "12px" }} />
            <Text style={{ color: "#374151", fontSize: "13px" }}>
              {record.dayOfBirth
                ? format(new Date(record.dayOfBirth), "dd/MM/yyyy")
                : "Chưa cập nhật"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (dateString) => (
        <div>
          <Text style={{ color: "#374151", fontSize: "13px", fontWeight: 500 }}>
            {dateString
              ? format(new Date(dateString), "dd/MM/yyyy")
              : "Chưa có"}
          </Text>
          {dateString && (
            <Text
              style={{ color: "#64748b", fontSize: "12px", display: "block" }}
            >
              {format(new Date(dateString), "HH:mm")}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa thông tin">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditParent(record)}
              disabled={isSubmitting}
              style={{
                color: modernTheme.colors.primary,
                borderRadius: modernTheme.borderRadius.md,
              }}
            />
          </Tooltip>
          <Tooltip title="Thêm học sinh">
            <Button
              type="text"
              icon={<TeamOutlined />}
              onClick={() => handleAddStudentForParent(record)}
              disabled={isSubmitting}
              style={{
                color: modernTheme.colors.success,
                borderRadius: modernTheme.borderRadius.md,
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tài khoản phụ huynh"
            description="Bạn có chắc chắn muốn xóa tài khoản này không?"
            onConfirm={() => handleDeleteParent(record.user_id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{
              danger: true,
              style: { borderRadius: modernTheme.borderRadius.md },
            }}
            cancelButtonProps={{
              style: { borderRadius: modernTheme.borderRadius.md },
            }}
          >
            <Tooltip title="Xóa tài khoản">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={isSubmitting}
                style={{
                  borderRadius: modernTheme.borderRadius.md,
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: modernTheme.colors.background,
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Enhanced Header */}
        <ParentPageHeader
          title="Quản lý Phụ huynh"
          description="Quản lý và giám sát tài khoản phụ huynh một cách hiệu quả"
          icon={<FaUserFriends />}
          statistics={pageStatistics}
        />

        {/* Enhanced Filter Bar */}
        <FilterBar
          searchText={searchText}
          onSearchChange={handleSearchChange}
          onAddParent={handleAddParent}
          onRefresh={fetchParentsData}
          isSubmitting={isSubmitting}
          totalCount={filteredParents.length}
        />

        {/* Enhanced Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...modernTheme.animations.smooth, delay: 0.4 }}
          style={{ marginTop: "24px" }}
        >
          <Card style={modernCardStyle}>
            <Table
              columns={columns}
              dataSource={filteredParents}
              rowKey="user_id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => (
                  <Text style={{ color: "#64748b", fontWeight: 500 }}>
                    Hiển thị {range[0]}-{range[1]} trong tổng số {total} phụ
                    huynh
                  </Text>
                ),
                style: { padding: "16px 0" },
              }}
              scroll={{ x: 1000 }}
              locale={{
                emptyText: (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={modernTheme.animations.smooth}
                    style={{ padding: "64px 0" }}
                  >
                    <Empty
                      image={
                        <div
                          style={{
                            fontSize: "64px",
                            color: "#d1d5db",
                            marginBottom: "16px",
                          }}
                        >
                          <FaUserFriends />
                        </div>
                      }
                      description={
                        <div>
                          <Title
                            level={4}
                            style={{ color: "#64748b", marginBottom: "8px" }}
                          >
                            {searchText
                              ? "Không tìm thấy phụ huynh"
                              : "Chưa có phụ huynh nào"}
                          </Title>
                          <Text
                            style={{
                              color: "#9ca3af",
                              maxWidth: "400px",
                              display: "block",
                              margin: "0 auto",
                            }}
                          >
                            {searchText
                              ? `Không có phụ huynh nào phù hợp với từ khóa "${searchText}"`
                              : "Danh sách phụ huynh sẽ hiển thị ở đây khi có dữ liệu."}
                          </Text>
                          {searchText && (
                            <Button
                              onClick={() => setSearchText("")}
                              style={{
                                marginTop: "16px",
                                borderRadius: modernTheme.borderRadius.lg,
                              }}
                            >
                              Xóa bộ lọc
                            </Button>
                          )}
                        </div>
                      }
                    />
                  </motion.div>
                ),
              }}
            />
          </Card>
        </motion.div>

        {/* Enhanced Parent Modal */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  backgroundColor: modernTheme.colors.parentTheme.primary,
                  borderRadius: modernTheme.borderRadius.md,
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ color: "white", fontSize: "16px" }} />
              </div>
              <span style={{ fontSize: "18px", fontWeight: 600 }}>
                {editingParent
                  ? "Chỉnh sửa thông tin Phụ huynh"
                  : "Thêm Phụ huynh mới"}
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            style={{ marginTop: "24px" }}
          >
            <Row gutter={16}>
              {/* Personal Information Section */}
              <Col span={24}>
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "16px",
                    borderRadius: modernTheme.borderRadius.lg,
                    marginBottom: "24px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Title
                    level={5}
                    style={{ margin: "0 0 16px 0", color: "#1e293b" }}
                  >
                    👤 Thông tin cá nhân
                  </Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="fullname"
                        label="Họ và tên"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên!" },
                          {
                            pattern: /^[\p{L}\s]{3,50}$/u,
                            message: "Chỉ chứa chữ và khoảng trắng.",
                          },
                          { min: 3, message: "Ít nhất 3 ký tự." },
                          { max: 50, message: "Không vượt quá 50 ký tự." },
                        ]}
                      >
                        <Input
                          placeholder="Nhập họ và tên"
                          style={{
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="dayofbirth"
                        label="Ngày sinh"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày sinh!",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{
                            width: "100%",
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày sinh"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn giới tính"
                          style={{ height: "40px" }}
                        >
                          <Option value="Male">Nam</Option>
                          <Option value="Female">Nữ</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="major"
                        label="Nghề nghiệp"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập nghề nghiệp!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập nghề nghiệp"
                          style={{
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Contact Information Section */}
              <Col span={24}>
                <div
                  style={{
                    backgroundColor: "#f0f9ff",
                    padding: "16px",
                    borderRadius: modernTheme.borderRadius.lg,
                    marginBottom: "24px",
                    border: "1px solid #bae6fd",
                  }}
                >
                  <Title
                    level={5}
                    style={{ margin: "0 0 16px 0", color: "#1e293b" }}
                  >
                    📞 Thông tin liên hệ
                  </Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email!" },
                          { type: "email", message: "Email không hợp lệ!" },
                          { max: 100, message: "Không vượt quá 100 ký tự." },
                        ]}
                      >
                        <Input
                          placeholder="Nhập địa chỉ email"
                          style={{
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại!",
                          },
                          {
                            pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                            message:
                              "SĐT không hợp lệ (VD: 0912345678 hoặc +84912345678)",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập số điện thoại"
                          style={{
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[
                          { required: true, message: "Vui lòng nhập địa chỉ!" },
                        ]}
                      >
                        <Input
                          placeholder="Nhập địa chỉ thường trú"
                          style={{
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Status Section */}
              <Col span={24}>
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "16px",
                    borderRadius: modernTheme.borderRadius.lg,
                    marginBottom: "24px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <Title
                    level={5}
                    style={{ margin: "0 0 16px 0", color: "#1e293b" }}
                  >
                    ⚙️ Trạng thái tài khoản
                  </Title>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="status"
                        label="Trạng thái hoạt động"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn trạng thái!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn trạng thái"
                          style={{ height: "40px" }}
                        >
                          <Option value={true}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <CheckCircleOutlined
                                style={{ color: modernTheme.colors.success }}
                              />
                              Hoạt động
                            </div>
                          </Option>
                          <Option value={false}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <CloseCircleOutlined
                                style={{ color: modernTheme.colors.error }}
                              />
                              Tạm ngưng
                            </div>
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Form Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                paddingTop: "24px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <Button
                onClick={() => setIsModalVisible(false)}
                disabled={isSubmitting}
                style={{
                  height: "40px",
                  padding: "0 24px",
                  borderRadius: modernTheme.borderRadius.md,
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                style={{
                  height: "40px",
                  padding: "0 24px",
                  borderRadius: modernTheme.borderRadius.md,
                  background: modernTheme.colors.parentTheme.gradient,
                  border: "none",
                  fontWeight: 600,
                }}
              >
                {editingParent ? "Cập nhật thông tin" : "Thêm phụ huynh mới"}
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Enhanced Student Modal */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  backgroundColor: modernTheme.colors.success,
                  borderRadius: modernTheme.borderRadius.md,
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaChild style={{ color: "white", fontSize: "16px" }} />
              </div>
              <span style={{ fontSize: "18px", fontWeight: 600 }}>
                Thêm học sinh cho: {selectedParent?.fullname || ""}
              </span>
            </div>
          }
          open={modalAddStudentForParent}
          onCancel={() => {
            setModalAddStudentForParent(false);
            setSelectedParent(null);
            addStudentForParentForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={addStudentForParentForm}
            layout="vertical"
            onFinish={handleSubmitAddStudentForParentForm}
            style={{ marginTop: "24px" }}
          >
            <Form.Item
              hidden
              name="parent_id"
              initialValue={selectedParent?.user_id}
            >
              <Input hidden />
            </Form.Item>

            <Form.Item name="student_code" initialValue={newStudentCode} hidden>
              <Input readOnly />
            </Form.Item>

            <Row gutter={16}>
              <Col span={24}>
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "16px",
                    borderRadius: modernTheme.borderRadius.lg,
                    marginBottom: "24px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <Title
                    level={5}
                    style={{ margin: "0 0 16px 0", color: "#1e293b" }}
                  >
                    👶 Thông tin học sinh
                  </Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="full_name"
                        label="Tên học sinh"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên học sinh",
                          },
                          {
                            min: 2,
                            message: "Tên học sinh phải có ít nhất 2 ký tự",
                          },
                          {
                            max: 50,
                            message: "Tên học sinh không vượt quá 50 ký tự",
                          },
                          {
                            validator: (_, value) => {
                              if (!value || /^[^\d]*$/.test(value)) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                "Tên học sinh không được chứa số"
                              );
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên học sinh"
                          style={{
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn giới tính"
                          style={{ height: "40px" }}
                          allowClear
                        >
                          <Select.Option value="male">Nam</Select.Option>
                          <Select.Option value="female">Nữ</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="day_of_birth"
                        label="Ngày sinh"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày sinh",
                          },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.resolve();
                              const today = new Date();
                              const selected = new Date(
                                value.format("YYYY-MM-DD")
                              );
                              if (selected >= today) {
                                return Promise.reject(
                                  "Ngày sinh không hợp lệ (trong tương lai)"
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <DatePicker
                          format="DD/MM/YYYY"
                          style={{
                            width: "100%",
                            height: "40px",
                            borderRadius: modernTheme.borderRadius.md,
                          }}
                          placeholder="Chọn ngày sinh"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="class_name"
                        label="Lớp"
                        rules={[
                          { required: true, message: "Vui lòng chọn lớp" },
                        ]}
                      >
                        <Select
                          placeholder="Chọn lớp học"
                          style={{ height: "40px" }}
                        >
                          {[
                            "1A1",
                            "1B",
                            "1C",
                            "2A",
                            "2B",
                            "2C",
                            "3A",
                            "3B",
                            "3C",
                            "4A",
                            "4B",
                            "4C",
                            "5A",
                            "5B",
                            "5C",
                          ].map((className) => (
                            <Select.Option key={className} value={className}>
                              {className}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Form Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                paddingTop: "24px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <Button
                onClick={() => {
                  setModalAddStudentForParent(false);
                  setSelectedParent(null);
                  addStudentForParentForm.resetFields();
                }}
                style={{
                  height: "40px",
                  padding: "0 24px",
                  borderRadius: modernTheme.borderRadius.md,
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  height: "40px",
                  padding: "0 24px",
                  borderRadius: modernTheme.borderRadius.md,
                  background: modernTheme.colors.success,
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Thêm học sinh
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

{
  /* Enhanced Global Styles */
}
<style jsx global>{`
  .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 2px solid #e2e8f0;
    font-weight: 700;
    color: #1e293b;
    padding: 20px 16px;
    font-size: 14px;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f1f5f9;
    padding: 20px 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .ant-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-card:hover {
    transform: translateY(-2px);
    box-shadow: ${modernTheme.shadows.hover} !important;
  }

  .ant-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-btn:hover {
    transform: translateY(-1px);
  }

  .ant-input,
  .ant-input-number,
  .ant-picker,
  .ant-select-selector {
    border-radius: ${modernTheme.borderRadius.md} !important;
    border: 2px solid #f3f4f6 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .ant-input:focus,
  .ant-input-focused,
  .ant-input-number:focus,
  .ant-input-number-focused,
  .ant-picker-focused,
  .ant-select-focused .ant-select-selector {
    border-color: ${modernTheme.colors.parentTheme.primary} !important;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1) !important;
  }

  .ant-pagination-item {
    border-radius: ${modernTheme.borderRadius.md} !important;
    border: 1px solid #e5e7eb !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .ant-pagination-item:hover {
    border-color: ${modernTheme.colors.parentTheme.primary} !important;
    transform: translateY(-1px) !important;
  }

  .ant-pagination-item-active {
    background: ${modernTheme.colors.parentTheme.primary} !important;
    border-color: ${modernTheme.colors.parentTheme.primary} !important;
  }

  .ant-pagination-item-active a {
    color: white !important;
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: ${modernTheme.borderRadius.md} !important;
    border: 1px solid #e5e7eb !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .ant-pagination-prev:hover,
  .ant-pagination-next:hover {
    border-color: ${modernTheme.colors.parentTheme.primary} !important;
    transform: translateY(-1px) !important;
  }

  .ant-modal-content {
    border-radius: ${modernTheme.borderRadius.xl} !important;
    box-shadow: ${modernTheme.shadows.hover} !important;
    overflow: hidden;
  }

  .ant-modal-header {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 24px !important;
    border-bottom: 1px solid #e2e8f0 !important;
  }

  .ant-modal-body {
    padding: 0 24px 24px 24px !important;
  }

  .ant-empty-image {
    margin-bottom: 16px !important;
  }

  .ant-badge-status-dot {
    width: 8px !important;
    height: 8px !important;
  }

  .ant-avatar {
    border: 2px solid rgba(22, 119, 255, 0.1) !important;
  }
`}</style>;
