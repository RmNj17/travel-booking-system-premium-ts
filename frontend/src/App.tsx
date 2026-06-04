import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api/client";
import { AdminPanel } from "./components/AdminPanel";
import { AppHeader } from "./components/AppHeader";
import { AuthPanel } from "./components/AuthPanel";
import { BookingDrawer } from "./components/BookingDrawer";
import { BookingTable } from "./components/BookingTable";
import { PackageCard } from "./components/PackageCard";
import { SignedInPanel } from "./components/SignedInPanel";
import {
  Booking,
  BookingStatus,
  CreatePackagePayload,
  Session,
  TravelPackage,
} from "./types";

const { Content, Footer } = Layout;
const { Paragraph, Text, Title } = Typography;

type BookingFormValues = {
  travelDate: dayjs.Dayjs;
  fullName: string;
  age: number;
  passportNo: string;
  nationality: string;
  paymentSimulation: "SUCCESS" | "FAILED";
};

function TravelBookingApp() {
  const { notification, modal } = AntApp.useApp();
  const [session, setSession] = useState<Session | null>(
    () =>
      JSON.parse(
        localStorage.getItem("travelmate.session") || "null",
      ) as Session | null,
  );
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destination, setDestination] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(
    null,
  );
  const [bookingOpen, setBookingOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | "ALL">(
    "ALL",
  );

  const isAdmin = session?.user.role === "ADMIN";
  const confirmedCount = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;
  const pendingApprovalCount = bookings.filter(
    (booking) => booking.status === "PENDING_PAYMENT",
  ).length;
  const completedCount = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;
  const cancelledOrRefundedCount = bookings.filter(
    (booking) =>
      booking.status === "CANCELLED" ||
      booking.status === "REFUND_REQUESTED" ||
      booking.status === "REFUNDED",
  ).length;
  const bookingStatuses: Array<BookingStatus> = [
    "PENDING_PAYMENT",
    "CONFIRMED",
    "PAYMENT_FAILED",
    "CANCELLED",
    "COMPLETED",
    "REFUND_REQUESTED",
    "REFUNDED",
  ];

  const filteredBookings = useMemo(() => {
    if (!isAdmin || bookingFilter === "ALL") return bookings;
    return bookings.filter((booking) => booking.status === bookingFilter);
  }, [bookings, bookingFilter, isAdmin]);
  const revenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount || 0),
    0,
  );

  const toast = useMemo(
    () => ({
      success: (message: string, description?: string) =>
        notification.success({ message, description, placement: "topRight" }),
      error: (message: string, description?: string) =>
        notification.error({ message, description, placement: "topRight" }),
      warning: (message: string, description?: string) =>
        notification.warning({ message, description, placement: "topRight" }),
      info: (message: string, description?: string) =>
        notification.info({ message, description, placement: "topRight" }),
    }),
    [notification],
  );

  async function loadPackages(searchText = destination) {
    setPackageLoading(true);
    try {
      const result = await api.getPackages(searchText);
      setPackages(result);
    } catch (error) {
      toast.error(
        "Unable to load packages",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setPackageLoading(false);
    }
  }

  async function loadBookings(activeSession = session) {
    if (!activeSession) {
      setBookings([]);
      return;
    }
    setBookingLoading(true);
    try {
      const result =
        activeSession.user.role === "ADMIN"
          ? await api.getAllBookings(activeSession.token)
          : await api.getMyBookings(activeSession.token);
      setBookings(result);
    } catch (error) {
      toast.error(
        "Unable to load bookings",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  }

  useEffect(() => {
    void loadPackages("");
  }, []);

  useEffect(() => {
    void loadBookings(session);
  }, [session?.token]);

  function saveSession(data: Session) {
    setSession(data);
    localStorage.setItem("travelmate.session", JSON.stringify(data));
  }

  async function login(values: { email: string; password: string }) {
    setActionLoading(true);
    try {
      const result = await api.login(values);
      saveSession(result);
      toast.success("Login successful", `Welcome, ${result.user.fullName}.`);
    } catch (error) {
      toast.error(
        "Login failed",
        error instanceof Error
          ? error.message
          : "Please check your credentials.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function register(values: {
    fullName: string;
    email: string;
    password: string;
  }) {
    setActionLoading(true);
    try {
      const result = await api.register(values);
      saveSession(result);
      toast.success(
        "Account created",
        "Your account is ready and you are now logged in.",
      );
    } catch (error) {
      toast.error(
        "Registration failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  function logout() {
    modal.confirm({
      title: "Logout from TravelMate?",
      content: "You can login again using the demo account anytime.",
      okText: "Logout",
      onOk: () => {
        localStorage.removeItem("travelmate.session");
        setSession(null);
        setBookings([]);
        toast.info("Logged out", "Your local session has been cleared.");
      },
    });
  }

  async function createBooking(values: BookingFormValues) {
    if (!session) {
      toast.warning(
        "Login required",
        "Please login before booking a travel package.",
      );
      return;
    }
    if (!selectedPackage) {
      toast.warning("Package not selected", "Please select a package first.");
      return;
    }

    setActionLoading(true);
    try {
      const booking = await api.createBooking(session.token, {
        packageId: selectedPackage.id,
        travelDate: values.travelDate.format("YYYY-MM-DD"),
        travellers: [
          {
            fullName: values.fullName,
            age: Number(values.age),
            passportNo: values.passportNo,
            nationality: values.nationality,
          },
        ],
      });
      const paidBooking = await api.payBooking(
        session.token,
        booking.id,
        values.paymentSimulation === "SUCCESS",
      );
      setBookingOpen(false);
      setSelectedPackage(null);
      toast.success(
        paidBooking.status === "PENDING_PAYMENT"
          ? "Booking submitted for review"
          : "Payment failed",
        paidBooking.status === "PENDING_PAYMENT"
          ? "Payment was processed. Your booking is now pending admin verification."
          : "The booking was created, but payment simulation returned failed.",
      );
      await loadPackages("");
      await loadBookings(session);
    } catch (error) {
      toast.error(
        "Booking could not be completed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  function openPackageCard(pkg: TravelPackage) {
    if (isAdmin) {
      setSelectedPackage(pkg);
      setAdminOpen(true);
      return;
    }

    setSelectedPackage(pkg);
    setBookingOpen(true);
  }

  function closeAdminPanel() {
    setAdminOpen(false);
    setSelectedPackage(null);
  }

  async function handleAdminSubmit(values: CreatePackagePayload) {
    if (!session) return;
    if (selectedPackage) {
      await updatePackage(selectedPackage.id, values);
      return;
    }
    await addPackage(values);
  }

  function confirmDeletePackage(pkg: TravelPackage) {
    modal.confirm({
      title: "Delete package?",
      content: `Remove "${pkg.title}" from the catalog? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deletePackage(pkg.id),
    });
  }

  async function deletePackage(id: number) {
    if (!session) return;
    setActionLoading(true);
    try {
      await api.deletePackage(session.token, id);
      toast.success(
        "Package deleted",
        "The package has been removed from the catalog.",
      );
      setSelectedPackage((current) => (current?.id === id ? null : current));
      await loadPackages("");
    } catch (error) {
      toast.error(
        "Could not delete package",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function updatePackage(id: number, values: CreatePackagePayload) {
    if (!session) return;
    setActionLoading(true);
    try {
      await api.updatePackage(session.token, id, values);
      toast.success(
        "Package updated",
        "The travel package details have been saved.",
      );
      await loadPackages("");
      closeAdminPanel();
    } catch (error) {
      toast.error(
        "Package could not be updated",
        error instanceof Error
          ? error.message
          : "Please check the form and try again.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function addPackage(values: CreatePackagePayload) {
    if (!session) return;
    setActionLoading(true);
    try {
      await api.createPackage(session.token, values);
      toast.success(
        "Package added",
        "The new travel package is now visible to customers.",
      );
      await loadPackages("");
    } catch (error) {
      toast.error(
        "Package could not be added",
        error instanceof Error
          ? error.message
          : "Please check the form and try again.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function updateBookingStatus(id: number, status: BookingStatus) {
    if (!session) return;
    setActionLoading(true);
    try {
      await api.updateBookingStatus(session.token, id, status);
      toast.success(
        "Booking status updated",
        `Booking #${id} is now ${status.replace(/_/g, " ")}.`,
      );
      await loadBookings(session);
    } catch (error) {
      toast.error(
        "Status update failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <Layout className="appShell">
      <AppHeader session={session} onLogout={logout} />

      <Content>
        <section className="heroSection">
          <div className="heroContent">
            <Title level={1}>
              Plan, book and manage travel packages from one polished dashboard.
            </Title>
            <Paragraph>
              A web application with customer booking, simulated payment, admin
              package management and booking history.
            </Paragraph>
            <Space wrap size="middle">
              <Input
                size="large"
                className="heroSearch"
                prefix={<SearchOutlined />}
                placeholder="Search destination, e.g. Bali, Tokyo, Dubai"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                onPressEnter={() => void loadPackages()}
              />
              <Button
                size="large"
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => void loadPackages()}
                loading={packageLoading}
              >
                Search Packages
              </Button>
              {isAdmin && (
                <Button
                  size="large"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedPackage(null);
                    setAdminOpen(true);
                  }}
                >
                  Add Travel Package
                </Button>
              )}
            </Space>
          </div>

          <Card className="signinCard" bordered={false}>
            {session ? (
              <SignedInPanel
                session={session}
                bookingsCount={bookings.length}
                confirmedCount={confirmedCount}
                revenue={revenue}
              />
            ) : (
              <AuthPanel
                onLogin={login}
                onRegister={register}
                loading={actionLoading}
              />
            )}
          </Card>
        </section>

        <main className="mainContent">
          <Row gutter={[18, 18]} className="statsRow">
            <Col xs={24} md={isAdmin ? 6 : 8}>
              <Card className="statCard">
                <Statistic
                  title="Available Packages"
                  value={packages.length}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} md={isAdmin ? 6 : 8}>
              <Card className="statCard">
                <Statistic
                  title={isAdmin ? "Total Bookings" : "My Bookings"}
                  value={bookings.length}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} md={isAdmin ? 6 : 8}>
              <Card className="statCard">
                <Statistic
                  title={isAdmin ? "Revenue" : "Confirmed Bookings"}
                  value={isAdmin ? revenue : confirmedCount}
                  prefix={isAdmin ? undefined : <CheckCircleOutlined />}
                  formatter={
                    isAdmin
                      ? (value) => `$${Number(value).toLocaleString()}`
                      : undefined
                  }
                />
              </Card>
            </Col>
            {isAdmin && (
              <>
                <Col xs={24} md={6}>
                  <Card className="statCard">
                    <Statistic
                      title="Completed Trips"
                      value={completedCount}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={6}>
                  <Card className="statCard">
                    <Statistic
                      title="Pending Approvals"
                      value={pendingApprovalCount}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={6}>
                  <Card className="statCard">
                    <Statistic
                      title="Cancelled / Refunded"
                      value={cancelledOrRefundedCount}
                      prefix={<CloseCircleOutlined />}
                    />
                  </Card>
                </Col>
              </>
            )}
          </Row>

          <div className="sectionHeader">
            <div>
              <Title level={2}>Available Travel Packages</Title>
              <Text type="secondary">
                Browse packages, check availability and create a booking.
              </Text>
            </div>
            <Space wrap>
              {isAdmin && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedPackage(null);
                    setAdminOpen(true);
                  }}
                >
                  Create Package
                </Button>
              )}
              <Button
                onClick={() => {
                  setDestination("");
                  void loadPackages("");
                }}
              >
                Reset Search
              </Button>
            </Space>
          </div>

          <Spin spinning={packageLoading}>
            {packages.length ? (
              <Row gutter={[20, 20]}>
                {packages.map((pkg) => (
                  <Col
                    xs={24}
                    md={12}
                    xl={8}
                    key={pkg.id}
                    style={{ display: "flex" }}
                  >
                    <PackageCard
                      pkg={pkg}
                      onSelect={() => openPackageCard(pkg)}
                      onDelete={
                        isAdmin ? () => confirmDeletePackage(pkg) : undefined
                      }
                      isAdmin={isAdmin}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card>
                <Empty description="No packages found" />
              </Card>
            )}
          </Spin>

          {session && (
            <section className="bookingSection">
              <div className="sectionHeader">
                <div>
                  <Title level={2}>
                    {isAdmin ? "All Bookings" : "My Booking History"}
                  </Title>
                </div>
                {isAdmin && (
                  <Space wrap>
                    <Button
                      icon={<CalendarOutlined />}
                      onClick={() => void loadBookings(session)}
                    >
                      Refresh
                    </Button>
                    <Select
                      value={bookingFilter}
                      onChange={(value) => setBookingFilter(value)}
                      options={[
                        { label: "All statuses", value: "ALL" },
                        ...bookingStatuses.map((status) => ({
                          label: status.replace(/_/g, " "),
                          value: status,
                        })),
                      ]}
                      style={{ width: 200 }}
                    />
                  </Space>
                )}
              </div>
              <Card className="tableCard">
                <BookingTable
                  bookings={filteredBookings}
                  isAdmin={Boolean(isAdmin)}
                  loading={bookingLoading || actionLoading}
                  onStatusChange={updateBookingStatus}
                />
              </Card>
            </section>
          )}
        </main>
      </Content>

      <BookingDrawer
        open={bookingOpen}
        pkg={selectedPackage}
        session={session}
        submitting={actionLoading}
        onClose={() => setBookingOpen(false)}
        onSubmit={createBooking}
      />

      <Modal
        title={
          selectedPackage ? "Edit Travel Package" : "Create a Travel Package"
        }
        open={adminOpen}
        onCancel={closeAdminPanel}
        footer={null}
        width={940}
        destroyOnClose
      >
        <AdminPanel
          loading={actionLoading}
          onSubmit={handleAdminSubmit}
          onCancelEdit={closeAdminPanel}
          initialValues={
            selectedPackage
              ? {
                  title: selectedPackage.title,
                  destination: selectedPackage.destination,
                  durationDays: selectedPackage.durationDays,
                  price: selectedPackage.price,
                  availableSeats: selectedPackage.availableSeats,
                  hotelDetails: selectedPackage.hotelDetails,
                  transport: selectedPackage.transport,
                  imageUrl: selectedPackage.imageUrl,
                  itinerary: selectedPackage.itinerary,
                }
              : undefined
          }
          submitLabel={selectedPackage ? "Save Changes" : "Add Package"}
        />
      </Modal>
    </Layout>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#155EEF",
          borderRadius: 16,
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        },
        components: {
          Card: { borderRadiusLG: 22 },
          Button: { borderRadius: 12 },
          Input: { borderRadius: 12 },
        },
      }}
    >
      <AntApp notification={{ placement: "topRight", duration: 3.6 }}>
        <TravelBookingApp />
      </AntApp>
    </ConfigProvider>
  );
}
