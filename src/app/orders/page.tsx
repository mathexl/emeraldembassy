"use client";

import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Order, CategorySetting, DISH_CATEGORIES } from "@/lib/sanity";

type Tab = "active" | "dismissed";

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #005851;
  padding: 24px 20px 60px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 500;
`;

const Tabs = styled.div`
  display: inline-flex;
  border: 1px solid #005851;
  border-radius: 10px;
  overflow: hidden;
`;

const TabBtn = styled.button<{ $active: boolean }>`
  background: ${(p) => (p.$active ? "#005851" : "#ffffff")};
  color: ${(p) => (p.$active ? "#FFE5BB" : "#005851")};
  border: none;
  padding: 10px 18px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const Ticket = styled.div<{ $dismissed?: boolean }>`
  background: ${(p) => (p.$dismissed ? "#ffffff" : "#FFE5BB")};
  color: #005851;
  border: 1px solid #005851;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: ${(p) => (p.$dismissed ? 0.75 : 1)};
`;

const TicketHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

const OrderNumber = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

const Seating = styled.span`
  display: inline-block;
  background: #005851;
  color: #FFE5BB;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.04em;
`;

const Elapsed = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.li`
  border-top: 1px dashed #005851;
  padding-top: 8px;
  &:first-child {
    border-top: none;
    padding-top: 0;
  }
`;

const ItemName = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const Meta = styled.div`
  font-size: 13px;
  opacity: 0.85;
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
  background: ${(p) => (p.$primary ? "#005851" : "transparent")};
  color: ${(p) => (p.$primary ? "#FFE5BB" : "#005851")};
  border: 1px solid #005851;
  border-radius: 10px;
  padding: 8px 14px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
`;

const Empty = styled.p`
  text-align: center;
  opacity: 0.6;
  padding: 40px 20px;
`;

const CategoryBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid #005851;
  border-radius: 12px;
  background: #ffffff;
  margin-bottom: 22px;
  align-items: center;
`;

const CategoryBarLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.7;
  margin-right: 6px;
`;

const CategoryToggle = styled.button<{ $on: boolean }>`
  border: 1px solid #005851;
  background: ${(p) => (p.$on ? "#005851" : "#ffffff")};
  color: ${(p) => (p.$on ? "#FFE5BB" : "#005851")};
  border-radius: 999px;
  padding: 6px 14px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const ToggleDot = styled.span<{ $on: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$on ? "#FFE5BB" : "#005851")};
`;

const ToggleHours = styled.span`
  font-size: 11px;
  opacity: 0.8;
`;

function elapsedSince(iso: string) {
  const then = new Date(iso).getTime();
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  const remMin = mins % 60;
  if (hrs < 24) return `${hrs}h ${remMin}m ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<CategorySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyCat, setBusyCat] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/categories", { cache: "no-store" });
    const data = await res.json();
    setCategories(data.categories ?? []);
  }, []);

  const loadOrders = useCallback(
    async (status: Tab, showSpinner = false) => {
      if (showSpinner) setLoading(true);
      try {
        const res = await fetch(`/api/orders?status=${status}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setOrders(data.orders ?? []);
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadOrders(tab, true);
    const poll = setInterval(() => loadOrders(tab), 4000);
    return () => clearInterval(poll);
  }, [tab, loadOrders]);

  useEffect(() => {
    loadCategories();
    const poll = setInterval(loadCategories, 8000);
    return () => clearInterval(poll);
  }, [loadCategories]);

  useEffect(() => {
    const tick = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(tick);
  }, []);

  async function updateStatus(id: string, action: "dismiss" | "restore") {
    setBusyId(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await loadOrders(tab);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleCategory(cat: CategorySetting) {
    setBusyCat(cat._id);
    setCategories((prev) =>
      prev.map((c) =>
        c._id === cat._id ? { ...c, enabled: !c.enabled } : c
      )
    );
    try {
      await fetch(`/api/categories/${cat._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !cat.enabled }),
      });
      await loadCategories();
    } finally {
      setBusyCat(null);
    }
  }

  const orderedCategories = DISH_CATEGORIES.map((name) =>
    categories.find((c) => c.category === name)
  ).filter((c): c is CategorySetting => Boolean(c));

  return (
    <Page>
      <Header>
        <Title>Orders</Title>
        <Tabs>
          <TabBtn $active={tab === "active"} onClick={() => setTab("active")}>
            Active
          </TabBtn>
          <TabBtn
            $active={tab === "dismissed"}
            onClick={() => setTab("dismissed")}
          >
            Dismissed
          </TabBtn>
        </Tabs>
      </Header>

      {orderedCategories.length > 0 && (
        <CategoryBar>
          <CategoryBarLabel>Categories</CategoryBarLabel>
          {orderedCategories.map((c) => (
            <CategoryToggle
              key={c._id}
              $on={c.enabled}
              disabled={busyCat === c._id}
              onClick={() => toggleCategory(c)}
              title={c.enabled ? "Click to turn off" : "Click to turn on"}
            >
              <ToggleDot $on={c.enabled} />
              {c.category}
              {c.hours && <ToggleHours>· {c.hours}</ToggleHours>}
            </CategoryToggle>
          ))}
        </CategoryBar>
      )}

      {loading ? (
        <Empty>Loading…</Empty>
      ) : orders.length === 0 ? (
        <Empty>
          {tab === "active"
            ? "No active orders."
            : "No dismissed orders."}
        </Empty>
      ) : (
        <Grid>
          {orders.map((o) => (
            <Ticket key={o._id} $dismissed={o.status === "dismissed"}>
              <TicketHead>
                <div>
                  <OrderNumber>#{o.orderNumber}</OrderNumber>
                  <Elapsed>{elapsedSince(o.createdAt)}</Elapsed>
                </div>
                <Seating>{o.seating}</Seating>
              </TicketHead>

              <ItemList>
                {o.items.map((it) => (
                  <Item key={it._key ?? it.dishName}>
                    <ItemName>
                      {it.quantity}× {it.dishName}
                    </ItemName>
                    {it.selectedOptions && it.selectedOptions.length > 0 && (
                      <Meta>
                        {it.selectedOptions
                          .map((o) => `${o.label}: ${o.choice}`)
                          .join(" · ")}
                      </Meta>
                    )}
                    {it.removedIngredients &&
                      it.removedIngredients.length > 0 && (
                        <Meta>No: {it.removedIngredients.join(", ")}</Meta>
                      )}
                    {it.notes && <Meta>Note: {it.notes}</Meta>}
                  </Item>
                ))}
              </ItemList>

              <Actions>
                {o.status === "active" ? (
                  <ActionBtn
                    $primary
                    disabled={busyId === o._id}
                    onClick={() => updateStatus(o._id, "dismiss")}
                  >
                    {busyId === o._id ? "…" : "Dismiss"}
                  </ActionBtn>
                ) : (
                  <ActionBtn
                    disabled={busyId === o._id}
                    onClick={() => updateStatus(o._id, "restore")}
                  >
                    {busyId === o._id ? "…" : "Restore"}
                  </ActionBtn>
                )}
              </Actions>
            </Ticket>
          ))}
        </Grid>
      )}
    </Page>
  );
}
