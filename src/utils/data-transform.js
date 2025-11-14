/**
 * Data Transformation Utilities
 * 
 * Utilities for transforming API responses to component-friendly formats.
 */

/**
 * Transform raffle data from API to component format
 */
export const transformRaffle = (raffle) => {
  if (!raffle) return null;

  return {
    id: raffle.id,
    title: raffle.title || raffle.name,
    description: raffle.description,
    prizes: raffle.prizes || [],
    consolationPrize: raffle.consolation_prize || { tokens: 1 },
    totalSlots: raffle.total_slots || raffle.totalSlots || 0,
    filledSlots: raffle.filled_slots || raffle.filledSlots || 0,
    tokensPerSlot: raffle.tokens_per_slot || raffle.tokensPerSlot || 0,
    isActive: raffle.is_active !== false,
    createdAt: raffle.created_at,
    updatedAt: raffle.updated_at,
  };
};

/**
 * Transform multiple raffles
 */
export const transformRaffles = (raffles) => {
  if (!Array.isArray(raffles)) return [];
  return raffles.map(transformRaffle).filter(Boolean);
};

/**
 * Transform card data from API to component format
 */
export const transformCard = (card) => {
  if (!card) return null;

  return {
    id: card.id,
    name: card.name || card.card_name,
    set: card.set || card.card_set,
    tier: card.tier || card.card_tier,
    tokenValue: card.token_value || card.tokenValue || 0,
    category: card.category || 'Pokemon',
    imageUrl: card.image_url || card.imageUrl,
    canRefund: card.can_refund !== false,
    canShip: card.can_ship !== false,
    createdAt: card.created_at,
  };
};

/**
 * Transform multiple cards
 */
export const transformCards = (cards) => {
  if (!Array.isArray(cards)) return [];
  return cards.map(transformCard).filter(Boolean);
};

/**
 * Transform mystery box data
 */
export const transformMysteryBox = (box) => {
  if (!box) return null;

  return {
    id: box.id,
    name: box.name || box.title,
    theme: box.theme,
    description: box.description,
    price: box.price || box.token_price || 0,
    cardTierRange: box.card_tier_range || box.cardTierRange,
    rarity: box.rarity,
    icon: box.icon,
    color: box.color,
    remainingBoxes: box.remaining_boxes || box.remainingBoxes || 0,
    totalBoxes: box.total_boxes || box.totalBoxes || 0,
    prizePool: box.prize_pool || box.prizePool || [],
    isActive: box.is_active !== false,
  };
};

/**
 * Transform pack opening data
 */
export const transformPackOpening = (opening) => {
  if (!opening) return null;

  return {
    id: opening.id,
    userId: opening.user_id || opening.userId,
    packId: opening.pack_id || opening.packId,
    packType: opening.pack_type || opening.packType,
    cards: opening.cards || [],
    openedAt: opening.opened_at || opening.created_at,
  };
};

/**
 * Transform user profile data
 */
export const transformUserProfile = (profile) => {
  if (!profile) return null;

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    phoneNumber: profile.phone_number || profile.phoneNumber,
    tokenBalance: profile.token_balance || profile.tokenBalance || 0,
    role: profile.role || 'user',
    avatar: profile.avatar,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
};

export default {
  transformRaffle,
  transformRaffles,
  transformCard,
  transformCards,
  transformMysteryBox,
  transformPackOpening,
  transformUserProfile,
};

