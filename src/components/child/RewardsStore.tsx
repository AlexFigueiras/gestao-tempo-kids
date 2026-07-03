import { useStore } from "../../store/useStore";
import { ScreenTimeBank } from "./ScreenTimeBank";
import type { Child } from "../../types";

interface RewardsStoreProps {
  child: Child;
}

export function RewardsStore({ child }: RewardsStoreProps) {
  const allRewards = useStore((s) => s.rewards);
  const rewards = allRewards.filter((r) => r.active);
  const redemptions = useStore((s) => s.redemptions);
  const redeemReward = useStore((s) => s.redeemReward);

  const pendingRewardIds = new Set(
    redemptions
      .filter((r) => r.childId === child.id && r.status === "pending_approval")
      .map((r) => r.rewardId)
  );

  return (
    <div>
      <ScreenTimeBank childId={child.id} balanceMinutes={child.screenTimeMinutes} />

      {child.moneyBalance > 0 && (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg mb-6">
          <p className="text-emerald-100 text-sm font-semibold mb-1">💰 Guardadinho</p>
          <p className="text-4xl font-extrabold">R$ {child.moneyBalance.toFixed(2)}</p>
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-800 mb-3">🎁 Loja de prêmios</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {rewards.map((reward) => {
          const canAfford = child.stars >= reward.cost;
          const isPending = pendingRewardIds.has(reward.id);
          return (
            <div key={reward.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
              <div className="text-3xl">{reward.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800">{reward.title}</p>
                <p className="text-sm text-amber-500 font-semibold">⭐ {reward.cost}</p>
              </div>
              <button
                onClick={() => redeemReward(reward.id, child.id)}
                disabled={!canAfford || isPending}
                className="px-3 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold whitespace-nowrap"
              >
                {isPending ? "⏳ Pedido" : canAfford ? "Resgatar" : "🔒"}
              </button>
            </div>
          );
        })}

        {rewards.length === 0 && (
          <p className="text-slate-400 col-span-2 text-center py-10">
            Ainda não há prêmios cadastrados. Peça para seus pais adicionarem!
          </p>
        )}
      </div>
    </div>
  );
}
