import { Select, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Booking, BookingStatus } from "../types";
import { money, prettyStatus, statusColor } from "../utils/format";

const { Text } = Typography;

type Props = {
  bookings: Booking[];
  isAdmin: boolean;
  loading: boolean;
  onStatusChange: (id: number, status: BookingStatus) => void;
};

const allStatuses: BookingStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PAYMENT_FAILED",
  "CANCELLED",
  "COMPLETED",
  "REFUND_REQUESTED",
  "REFUNDED",
];

function getAllowedStatuses(currentStatus: BookingStatus): BookingStatus[] {
  const transitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING_PAYMENT: [
      "PENDING_PAYMENT",
      "CONFIRMED",
      "PAYMENT_FAILED",
      "CANCELLED",
    ],
    CONFIRMED: ["CONFIRMED", "COMPLETED", "CANCELLED"],
    PAYMENT_FAILED: ["PAYMENT_FAILED", "CANCELLED"],
    CANCELLED: ["CANCELLED"],
    COMPLETED: ["COMPLETED"],
    REFUND_REQUESTED: ["REFUNDED"],
    REFUNDED: ["REFUNDED"],
  };

  return transitions[currentStatus] ?? allStatuses;
}

export function BookingTable({
  bookings,
  isAdmin,
  loading,
  onStatusChange,
}: Props) {
  const columns: ColumnsType<Booking> = [
    { title: "Customer", render: (_, row) => row.user?.fullName || "-" },
    {
      title: "Traveller",
      render: (_, row) => {
        const names = row.travellers
          ?.map((traveller) => traveller.fullName)
          .filter(Boolean);
        return names && names.length > 0 ? names.join(", ") : "-";
      },
    },
    {
      title: "Package",
      render: (_, row) => <Text strong>{row.package?.title || "-"}</Text>,
    },
    { title: "Travel Date", dataIndex: "travelDate" },
    { title: "Travellers", render: (_, row) => row.travellers?.length || 0 },
    { title: "Amount", render: (_, row) => money(row.totalAmount) },
    {
      title: "Payment Status",
      render: (_, row) => (
        <Tag
          color={
            row.payment?.status === "SUCCESS"
              ? "green"
              : row.payment?.status === "FAILED"
                ? "red"
                : "orange"
          }
          style={{ fontWeight: 700, borderRadius: 16 }}
        >
          {prettyStatus(row.payment?.status || "PENDING")}
        </Tag>
      ),
    },
    {
      title: "Booking Status",
      width: 170,
      render: (_, row) =>
        isAdmin ? (
          <Select
            size="small"
            value={{ value: row.status, label: prettyStatus(row.status) }}
            labelInValue
            style={{ width: 180, minWidth: 180 }}
            onChange={(value) =>
              onStatusChange(row.id, value.value as BookingStatus)
            }
          >
            {getAllowedStatuses(row.status).map((status) => (
              <Select.Option
                key={status}
                value={status}
                label={prettyStatus(status)}
              >
                {prettyStatus(status)}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Tag color={statusColor(row.status)} style={{ fontWeight: 700 }}>
            {prettyStatus(row.status)}
          </Tag>
        ),
    },
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={bookings}
      columns={columns}
      pagination={{ pageSize: 5 }}
      scroll={{ x: 980 }}
    />
  );
}
