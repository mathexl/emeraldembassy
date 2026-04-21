"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  sanityRead,
  Dish,
  DISH_CATEGORIES,
  CategorySetting,
  SelectedOption,
} from "@/lib/sanity";

type CartItem = {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  removedIngredients: string[];
  selectedOptions: SelectedOption[];
  notes: string;
};

const SEATING = ["Dining Room", "Window Lounge", "Bedroom"] as const;
type Seating = (typeof SEATING)[number];

const Page = styled.div`
  min-height: 100vh;
  background: #005851;
  color: #FFE5BB;
  padding: 32px 20px 140px;
  max-width: 100%;
`;

const Inner = styled.div`
  max-width: 880px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 36px;
`;

const Title = styled.h1`
  font-size: clamp(28px, 5vw, 44px);
  margin: 0;
  letter-spacing: 0.02em;
  font-weight: 500;
`;

const Subtitle = styled.p`
  margin: 6px 0 0;
  opacity: 0.7;
  font-size: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

const Section = styled.section<{ $disabled?: boolean }>`
  margin-bottom: 32px;
  opacity: ${(p) => (p.$disabled ? 0.45 : 1)};
  pointer-events: ${(p) => (p.$disabled ? "none" : "auto")};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #FFE5BB;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.04em;
`;

const SectionMeta = styled.div`
  font-size: 13px;
  opacity: 0.75;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClosedTag = styled.span`
  background: #FFE5BB;
  color: #005851;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const DishCard = styled.button<{ $unavailable?: boolean }>`
  text-align: left;
  background: #FFE5BB;
  color: #005851;
  border: 1px solid #005851;
  border-radius: 14px;
  padding: 18px;
  cursor: ${(p) => (p.$unavailable ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$unavailable ? 0.45 : 1)};
  font: inherit;
  transition: transform 0.1s ease;
  position: relative;
  &:hover {
    transform: ${(p) => (p.$unavailable ? "none" : "translateY(-2px)")};
  }
`;

const UnavailableTag = styled.span`
  display: inline-block;
  background: #005851;
  color: #FFE5BB;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 8px;
`;

const DishName = styled.div`
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const DishDesc = styled.div`
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 88, 81, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 20;
`;

const Sheet = styled.div`
  background: #ffffff;
  color: #005851;
  width: 100%;
  max-width: 560px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border: 1px solid #005851;
  padding: 22px 22px 28px;
  max-height: 90vh;
  overflow-y: auto;
`;

const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 10px;
`;

const SheetTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #005851;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
`;

const Label = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 18px 0 8px;
  opacity: 0.75;
`;

const Checkline = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  cursor: pointer;
  font-size: 15px;
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid #005851;
  border-radius: 10px;
  background: #fff;
  color: #005851;
  padding: 10px 12px;
  font: inherit;
  resize: vertical;
  min-height: 70px;
`;

const PrimaryBtn = styled.button`
  background: #005851;
  color: #FFE5BB;
  border: none;
  border-radius: 12px;
  padding: 14px 22px;
  font: inherit;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GhostBtn = styled.button`
  background: transparent;
  color: #005851;
  border: 1px solid #005851;
  border-radius: 12px;
  padding: 10px 16px;
  font: inherit;
  cursor: pointer;
`;

const CartBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 18px;
  background: #FFE5BB;
  color: #005851;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.2);
`;

const CartBtn = styled.button`
  background: #005851;
  color: #FFE5BB;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CartRow = styled.li`
  border: 1px solid #005851;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const SeatingRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const SeatingChip = styled.button<{ $selected: boolean }>`
  border: 1px solid #005851;
  background: ${(p) => (p.$selected ? "#005851" : "#ffffff")};
  color: ${(p) => (p.$selected ? "#FFE5BB" : "#005851")};
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
`;

const ConfirmWrap = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const BigNumber = styled.div`
  font-size: 88px;
  font-weight: 600;
  color: #FFE5BB;
`;

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categorySettings, setCategorySettings] = useState<CategorySetting[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [draftRemoved, setDraftRemoved] = useState<string[]>([]);
  const [draftOptions, setDraftOptions] = useState<Record<string, string>>({});
  const [draftNotes, setDraftNotes] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [seating, setSeating] = useState<Seating | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedNumber, setConfirmedNumber] = useState<number | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      const [dishData, catRes] = await Promise.all([
        sanityRead.fetch<Dish[]>(
          `*[_type == "dish"] | order(rank asc, name asc){
            _id, name, category, description, available, removableIngredients, rank,
            options[]{ label, choices }
          }`
        ),
        fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setDishes(dishData);
      setCategorySettings(catRes.categories ?? []);
      setLoading(false);
    };
    loadAll();
    const poll = setInterval(async () => {
      const [catRes, dishRes] = await Promise.all([
        fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/dishes", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setCategorySettings(catRes.categories ?? []);
      setDishes((prev) => {
        const availMap = new Map<string, boolean>(
          (dishRes.dishes ?? []).map((d: { _id: string; available: boolean }) => [
            d._id,
            d.available,
          ])
        );
        return prev.map((d) =>
          availMap.has(d._id) ? { ...d, available: availMap.get(d._id)! } : d
        );
      });
    }, 5000);
    return () => clearInterval(poll);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const settingByCategory = useMemo(() => {
    const map = new Map<string, CategorySetting>();
    for (const s of categorySettings) map.set(s.category, s);
    return map;
  }, [categorySettings]);

  const dishesByCategory = useMemo(() => {
    const map = new Map<string, Dish[]>();
    for (const d of dishes) {
      const key = d.category ?? "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return map;
  }, [dishes]);

  const orderedCategories = useMemo(() => {
    const present = new Set(dishesByCategory.keys());
    const known = DISH_CATEGORIES.filter((c) => present.has(c));
    const extras = [...present].filter(
      (c) => !DISH_CATEGORIES.includes(c as typeof DISH_CATEGORIES[number])
    );
    return [...known, ...extras];
  }, [dishesByCategory]);

  function openDish(dish: Dish) {
    setSelectedDish(dish);
    setDraftRemoved([]);
    setDraftNotes("");
    const defaults: Record<string, string> = {};
    for (const opt of dish.options ?? []) {
      if (opt.choices.length > 0) defaults[opt.label] = opt.choices[0];
    }
    setDraftOptions(defaults);
  }

  function toggleRemoved(ing: string) {
    setDraftRemoved((prev) =>
      prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]
    );
  }

  function addToCart() {
    if (!selectedDish) return;
    const selectedOptions: SelectedOption[] = (selectedDish.options ?? [])
      .filter((o) => draftOptions[o.label])
      .map((o) => ({ label: o.label, choice: draftOptions[o.label] }));
    setCart((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        dishId: selectedDish._id,
        dishName: selectedDish.name,
        quantity: 1,
        removedIngredients: draftRemoved,
        selectedOptions,
        notes: draftNotes.trim(),
      },
    ]);
    setSelectedDish(null);
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  async function submitOrder() {
    if (!seating || cart.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seating,
          items: cart.map((i) => ({
            dishId: i.dishId,
            dishName: i.dishName,
            quantity: i.quantity,
            removedIngredients: i.removedIngredients,
            selectedOptions: i.selectedOptions,
            notes: i.notes,
          })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { orderNumber: number };
      setConfirmedNumber(data.orderNumber);
      setCart([]);
      setCartOpen(false);
      setSeating(null);
    } catch (err) {
      alert("Something went wrong submitting the order. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedNumber !== null) {
    return (
      <Page>
        <Inner>
          <ConfirmWrap>
            <Label>Your order number</Label>
            <BigNumber>#{confirmedNumber}</BigNumber>
            <p style={{ marginTop: 20, opacity: 0.75 }}>
              We&apos;ll bring it out shortly.
            </p>
            <GhostBtn
              style={{ marginTop: 28 }}
              onClick={() => setConfirmedNumber(null)}
            >
              Place another order
            </GhostBtn>
          </ConfirmWrap>
        </Inner>
      </Page>
    );
  }

  return (
    <Page>
      <Inner>
        <Header>
          <Title>SECRET HOME CAFE</Title>
          <Subtitle>Tap a dish to order.</Subtitle>
        </Header>

      {loading ? (
        <p style={{ textAlign: "center", opacity: 0.6 }}>Loading menu…</p>
      ) : dishes.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.6 }}>
          No dishes available right now.
        </p>
      ) : (
        orderedCategories.map((cat) => {
          const setting = settingByCategory.get(cat);
          const disabled = setting ? setting.enabled === false : false;
          return (
            <Section key={cat} $disabled={disabled} aria-disabled={disabled}>
              <SectionHeader>
                <SectionTitle>{cat}</SectionTitle>
                <SectionMeta>
                  {setting?.hours && <span>{setting.hours}</span>}
                  {disabled && <ClosedTag>Closed</ClosedTag>}
                </SectionMeta>
              </SectionHeader>
              <Grid>
                {dishesByCategory.get(cat)!.map((d) => {
                  const unavailable = d.available === false;
                  const cantOrder = disabled || unavailable;
                  return (
                    <DishCard
                      key={d._id}
                      onClick={() => !cantOrder && openDish(d)}
                      disabled={cantOrder}
                      $unavailable={unavailable}
                    >
                      <DishName>{d.name}</DishName>
                      {d.description && <DishDesc>{d.description}</DishDesc>}
                      {unavailable && !disabled && (
                        <UnavailableTag>Not Available</UnavailableTag>
                      )}
                    </DishCard>
                  );
                })}
              </Grid>
            </Section>
          );
        })
      )}
      </Inner>

      {selectedDish && (
        <Overlay onClick={() => setSelectedDish(null)}>
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetHeader>
              <div>
                <SheetTitle>{selectedDish.name}</SheetTitle>
                {selectedDish.description && (
                  <DishDesc style={{ marginTop: 6 }}>
                    {selectedDish.description}
                  </DishDesc>
                )}
              </div>
              <CloseBtn onClick={() => setSelectedDish(null)}>×</CloseBtn>
            </SheetHeader>

            {selectedDish.options?.map((opt) => (
              <div key={opt.label}>
                <Label>{opt.label}</Label>
                {opt.choices.map((ch) => (
                  <Checkline key={ch}>
                    <input
                      type="radio"
                      name={`opt-${opt.label}`}
                      checked={draftOptions[opt.label] === ch}
                      onChange={() =>
                        setDraftOptions((prev) => ({ ...prev, [opt.label]: ch }))
                      }
                    />
                    <span>{ch}</span>
                  </Checkline>
                ))}
              </div>
            ))}

            {selectedDish.removableIngredients &&
              selectedDish.removableIngredients.length > 0 && (
                <>
                  <Label>Remove ingredients</Label>
                  {selectedDish.removableIngredients.map((ing) => (
                    <Checkline key={ing}>
                      <input
                        type="checkbox"
                        checked={draftRemoved.includes(ing)}
                        onChange={() => toggleRemoved(ing)}
                      />
                      <span>{ing}</span>
                    </Checkline>
                  ))}
                </>
              )}

            <Label>Notes for the kitchen</Label>
            <Textarea
              placeholder="Anything else?"
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
            />

            <PrimaryBtn onClick={addToCart}>Add to order</PrimaryBtn>
          </Sheet>
        </Overlay>
      )}

      {cartOpen && (
        <Overlay onClick={() => setCartOpen(false)}>
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetHeader>
              <SheetTitle>Your order</SheetTitle>
              <CloseBtn onClick={() => setCartOpen(false)}>×</CloseBtn>
            </SheetHeader>

            {cart.length === 0 ? (
              <p style={{ opacity: 0.6 }}>Empty.</p>
            ) : (
              <CartList>
                {cart.map((i) => (
                  <CartRow key={i.id}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {i.quantity}× {i.dishName}
                      </div>
                      {i.selectedOptions.length > 0 && (
                        <div style={{ fontSize: 13, opacity: 0.75 }}>
                          {i.selectedOptions
                            .map((o) => `${o.label}: ${o.choice}`)
                            .join(" · ")}
                        </div>
                      )}
                      {i.removedIngredients.length > 0 && (
                        <div style={{ fontSize: 13, opacity: 0.75 }}>
                          No: {i.removedIngredients.join(", ")}
                        </div>
                      )}
                      {i.notes && (
                        <div
                          style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}
                        >
                          Note: {i.notes}
                        </div>
                      )}
                    </div>
                    <GhostBtn
                      style={{ padding: "4px 10px", fontSize: 13 }}
                      onClick={() => removeFromCart(i.id)}
                    >
                      Remove
                    </GhostBtn>
                  </CartRow>
                ))}
              </CartList>
            )}

            <Label>Where are you seated?</Label>
            <SeatingRow>
              {SEATING.map((s) => (
                <SeatingChip
                  key={s}
                  $selected={seating === s}
                  onClick={() => setSeating(s)}
                >
                  {s}
                </SeatingChip>
              ))}
            </SeatingRow>

            <PrimaryBtn
              disabled={!seating || cart.length === 0 || submitting}
              onClick={submitOrder}
            >
              {submitting ? "Submitting…" : "Submit order"}
            </PrimaryBtn>
          </Sheet>
        </Overlay>
      )}

      {cartCount > 0 && !cartOpen && (
        <CartBar>
          <div>
            {cartCount} item{cartCount === 1 ? "" : "s"} in your order
          </div>
          <CartBtn onClick={() => setCartOpen(true)}>Review &amp; submit</CartBtn>
        </CartBar>
      )}
    </Page>
  );
}
