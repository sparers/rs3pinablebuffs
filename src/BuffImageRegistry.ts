import * as a1lib from 'alt1';

export class BuffImageRegistry {
  private static Buffs: any = null;
  private static Incense: any = null;
  private static Debuffs: any = null;
  private static Ultimates: any = null;
  private static Sigils: any = null;
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    this.Buffs = await a1lib.webpackImages({
      animateDead: require('./imgs/buffs/Animate_Dead-noborder.data.png'),
      darkness: require('./imgs/buffs/Darkness-noborder.data.png'),
      elderOverload: require('./imgs/buffs/Elder_Overload-noborder.data.png'),
      supremeOverloadActive: require('./imgs/buffs/Supreme_Overload_Potion_Active-noborder.data.png'),
      fsoaWeaponSpec: require('./imgs/buffs/fsoaSpecBuff-noborder.data.png'),
      gladiatorsRage: require('./imgs/buffs/Gladiators_Rage-noborder.data.png'),
      necrosis: require('./imgs/buffs/Necrosis-noborder.data.png'),
      overloaded: require('./imgs/buffs/Overloaded-noborder.data.png'),
      supreme_overloaded: require('./imgs/buffs/supreme_overload.data.png'),
      balanceByForce: require('./imgs/buffs/balance_by_force-beta.data.png'),
      perfectEquilibriumNoBorder: require('./imgs/buffs/Perfect_Equilibrium-noborder.data.png'),
      poisonous: require('./imgs/buffs/Poisonous-top-noborder.data.png'),
      prayerRenewActive: require('./imgs/buffs/Prayer_Renew_Active-noborder.data.png'),
      timeRift: require('./imgs/buffs/Time_rift-noborder.data.png'),
      aura: require('./imgs/buffs/Aura-noborder.data.png'),
      bonfireBoost: require('./imgs/buffs/Bonfire_Boost-noborder.data.png'),
      grimoire: require("./imgs/buffs/Erethdor's_grimoire-noborder.data.png"),
      Anticipation: require('./imgs/buffs/Anticipation.data.png'),
      Barricade: require('./imgs/buffs/Barricade.data.png'),
      Devotion: require('./imgs/buffs/Devotion.data.png'),
      Divert: require('./imgs/buffs/Divert.data.png'),
      Freedom: require('./imgs/buffs/Freedom.data.png'),
      Immortality: require('./imgs/buffs/Immortality.data.png'),
      Reflect: require('./imgs/buffs/Reflect.data.png'),
      Resonance: require('./imgs/buffs/Resonance.data.png'),
      SplitSoul: require('./imgs/buffs/Split_Soul.data.png'),
      Antifire: require('./imgs/buffs/antifire_top.data.png'),
      DeathSpark: require('./imgs/buffs/Death_Spark.data.png'),
      ThreadsOfFate: require('./imgs/buffs/Threads_of_Fate.data.png'),
      ConjureSkeleton: require('./imgs/buffs/skeleton_warrior-top.data.png'),
      ConjureZombie: require('./imgs/buffs/putrid_zombie-top.data.png'),
      ConjureGhost: require('./imgs/buffs/vengeful_ghost-top.data.png'),
      SplitSoulECB: require('./imgs/buffs/split_soul_ecb.data.png'),
      AggressionPotion: require('./imgs/buffs/aggression_potion.data.png'),
      PowderOfProtection: require('./imgs/buffs/powder_of_protection.data.png'),
      PowderOfPenance: require('./imgs/buffs/powder_of_penance.data.png'),
      InvokeLordOfBones: require('./imgs/buffs/Invoke_Lord_of_Bones.data.png'),
      adrenCrit: require('./imgs/buffs/Adren_Crit_Buff.data.png'),
      glacialEmbrace: require('./imgs/buffs/Glacial_Embrace-noborder.data.png'),
      bloodTithe: require('./imgs/buffs/Blood_Tithe-noborder.data.png'),
    }).promise;

    this.Incense = await a1lib.webpackImages({
      lantadyme: require('./imgs/buffs/Lantadyme.data.png'),
      dwarfWeed: require('./imgs/buffs/Dwarf_Weed.data.png'),
      fellstalk: require('./imgs/buffs/Fellstalk.data.png'),
      kwuarm: require('./imgs/buffs/Kwuarm.data.png'),
    }).promise;

    this.Debuffs = await a1lib.webpackImages({
      elvenRitualShard: require('./imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png'),
      adrenalinePotion: require('./imgs/buffs/Adrenaline_Potion-noborder.data.png'),
      deathGraspDebuff: require('./imgs/buffs/Death_Guard_Special-top-noborder.data.png'),
      deathEssenceDebuff: require('./imgs/buffs/Omni_Guard_Special-top-noborder.data.png'),
      enhancedExcaliburDebuff: require('./imgs/buffs/EE_scuffed-top-noborder.data.png'),
      crystalRainMinimal: require('./imgs/buffs/Crystal_Rain-minimal-noborder.data.png'),
      stunnedDebuff: require('./imgs/buffs/Stunned.data.png'),
      signOfLifeDebuff: require('./imgs/buffs/Sign_of_Life-top.data.png'),
      powerburstPrevention: require('./imgs/buffs/Powerburst_prevention.data.png'),
      FeastingSpores: require('./imgs/buffs/deathspore_arrows.data.png'),
    }).promise;

    this.Ultimates = await a1lib.webpackImages({
      berserk: require('./imgs/buffs/Berserk-noborder.data.png'),
      deathsSwiftness: require('./imgs/buffs/Deaths_Swiftness-top.data.png'),
      greaterDeathsSwiftness: require("./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png"),
      greaterSunshine: require('./imgs/buffs/Greater_Sunshine-noborder.data.png'),
      livingDeath: require('./imgs/buffs/Living_Death-noborder.data.png'),
      sunshine: require('./imgs/buffs/Sunshine-noborder.data.png'),
    }).promise;

    this.Sigils = await a1lib.webpackImages({
      limitless: require('./imgs/buffs/Limitless-noborder.data.png'),
      demonSlayer: require('./imgs/buffs/Demon_Slayer-noborder.data.png'),
      dragonSlayer: require('./imgs/buffs/Dragon_Slayer-noborder.data.png'),
      undeadSlayer: require('./imgs/buffs/Undead_Slayer-noborder.data.png'),
      ingenuityOfTheHumans: require('./imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png'),
    }).promise;

    this._buffData = [
      // --- BUFFS ---
      { name: "Overload", image: this.Buffs.overloaded, threshold: 300, path: './imgs/buffs/Overloaded-noborder.data.png' },
      { name: "Elder Overload", image: this.Buffs.elderOverload, threshold: 60, path: './imgs/icons/Elder_overload_potion_(6).png' },
      { name: "Supreme Overload", image: this.Buffs.supremeOverloadActive, threshold: 30, path: './imgs/buffs/icons/Supreme_overload_potion_(6).png' },
      { name: "Weapon Poison", image: this.Buffs.poisonous, threshold: 300, path: './imgs/icons/Weapon_poison+++_(4).png' },
      { name: "Darkness", image: this.Buffs.darkness, threshold: 400, path: './imgs/icons/Darkness_icon.png' },
      { name: "Animate Dead", image: this.Buffs.animateDead, threshold: 60, path: './imgs/buffs/Animate_Dead-noborder.data.png' },
      { name: "FSOA Spec", image: this.Buffs.fsoaWeaponSpec, threshold: 80, path: './imgs/buffs/fsoaSpecBuff-noborder.data.png' },
      { name: "Time Rift", image: this.Buffs.timeRift, threshold: 450, path: './imgs/buffs/Time_rift-noborder.data.png' },
      { name: "Gladiators Rage", image: this.Buffs.gladiatorsRage, threshold: 50, path: './imgs/buffs/Gladiators_Rage-noborder.data.png' },
      { name: "Necrosis", image: this.Buffs.necrosis, threshold: 150, path: './imgs/buffs/Necrosis-noborder.data.png' },
      { name: "Aura", image: this.Buffs.aura, threshold: 400, path: './imgs/icons/Equilibrium_aura.png' },
      { name: "Bonfire Boost", image: this.Buffs.bonfireBoost, threshold: 400, path: './imgs/buffs/Bonfire_Boost-noborder.data.png' },
      { name: "Grimoire", image: this.Buffs.grimoire, threshold: 55, path: "./imgs/buffs/Erethdor's_grimoire-noborder.data.png" },
      { name: "Lantadyme Incense", image: this.Incense.lantadyme, threshold: 119, path: './imgs/icons/Lantadyme_incense_sticks.png' },
      { name: "Dwarf Weed Incense", image: this.Incense.dwarfWeed, threshold: 150, path: './imgs/buffs/Dwarf_Weed.data.png' },
      { name: "Fellstalk Incense", image: this.Incense.fellstalk, threshold: 150, path: './imgs/buffs/Fellstalk.data.png' },
      { name: "Kwuarm Incense", image: this.Incense.kwuarm, threshold: 150, path: './imgs/buffs/Kwuarm.data.png' },
      // { name: "Antifire", image: this.Buffs.Antifire, threshold: 225, path: './imgs/buffs/antifire_top.data.png' },
      { name: "Aggression Potion", image: this.Buffs.AggressionPotion, threshold: 120, path: './imgs/buffs/aggression_potion.data.png' },
      { name: "Powder of Protection", image: this.Buffs.PowderOfProtection, threshold: 130, path: './imgs/buffs/powder_of_protection.data.png' },
      { name: "Powder of Penance", image: this.Buffs.PowderOfPenance, threshold: 130, path: './imgs/buffs/powder_of_penance.data.png' },
      //{ name: "Prayer Renewal", image: this.Buffs.prayerRenewActive, threshold: 225, path: './imgs/buffs/Prayer_Renew_Active-noborder.data.png' },
      { name: "Death Spark", image: this.Buffs.DeathSpark, threshold: 300, path: './imgs/buffs/Death_Spark.data.png' },
      { name: "Balance By Force", image: this.Buffs.balanceByForce, threshold: 30, path: './imgs/buffs/balance_by_force-beta.data.png' },
      { name: "BOLG Stacks", image: this.Buffs.perfectEquilibriumNoBorder, threshold: 300, path: './imgs/buffs/Perfect_Equilibrium-noborder.data.png' },
      { name: "Anticipation", image: this.Buffs.Anticipation, threshold: 300, path: './imgs/buffs/Anticipation.data.png' },
      { name: "Barricade", image: this.Buffs.Barricade, threshold: 300, path: './imgs/icons/Barricade.png' },
      { name: "Devotion", image: this.Buffs.Devotion, threshold: 300, path: './imgs/buffs/Devotion.data.png' },
      { name: "Divert", image: this.Buffs.Divert, threshold: 300, path: './imgs/buffs/Divert.data.png' },
      { name: "Freedom", image: this.Buffs.Freedom, threshold: 300, path: './imgs/buffs/Freedom.data.png' },
      { name: "Immortality", image: this.Buffs.Immortality, threshold: 300, path: './imgs/buffs/Immortality.data.png' },
      { name: "Reflect", image: this.Buffs.Reflect, threshold: 300, path: './imgs/buffs/Reflect.data.png' },
      { name: "Resonance", image: this.Buffs.Resonance, threshold: 300, path: './imgs/buffs/Resonance.data.png' },
      { name: "Split Soul", image: this.Buffs.SplitSoul, threshold: 350, path: './imgs/buffs/Split_Soul.data.png' },
      { name: "Threads of Fate", image: this.Buffs.ThreadsOfFate, threshold: 300, path: './imgs/buffs/Threads_of_Fate.data.png' },
      { name: "Conjure Skeleton", image: this.Buffs.ConjureSkeleton, threshold: 300, path: './imgs/buffs/skeleton_warrior-top.data.png' },
      { name: "Conjure Zombie", image: this.Buffs.ConjureZombie, threshold: 300, path: './imgs/buffs/putrid_zombie-top.data.png' },
      { name: "Conjure Ghost", image: this.Buffs.ConjureGhost, threshold: 300, path: './imgs/buffs/vengeful_ghost-top.data.png' },
      { name: "Split Soul ECB", image: this.Buffs.SplitSoulECB, threshold: 60, path: './imgs/buffs/split_soul_ecb.data.png' },
      { name: "Invoke Lord of Bones", image: this.Buffs.InvokeLordOfBones, threshold: 180, path: './imgs/buffs/Invoke_Lord_of_Bones.data.png' },
      { name: "Adren Crit", image: this.Buffs.adrenCrit, threshold: 300, path: './imgs/buffs/Adren_Crit_Buff.data.png' },
      { name: "Glacial Embrace", image: this.Buffs.glacialEmbrace, threshold: 60, path: './imgs/buffs/Glacial_Embrace-noborder.data.png' },
      { name: "Blood Tithe", image: this.Buffs.bloodTithe, threshold: 60, path: './imgs/buffs/Blood_Tithe-noborder.data.png' },

      // --- DEBUFFS ---
      { name: "Ancient Elven Ritual Shard", image: this.Debuffs.elvenRitualShard, threshold: 90, path: './imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png' },
      { name: "Adrenaline Potion Debuff", image: this.Debuffs.adrenalinePotion, threshold: 300, path: './imgs/buffs/Adrenaline_Potion-noborder.data.png' },
      { name: "Death Guard Debuff", image: this.Debuffs.deathGraspDebuff, threshold: 90, path: './imgs/buffs/Death_Guard_Special-top-noborder.data.png' },
      { name: "Omni Guard Debuff", image: this.Debuffs.deathEssenceDebuff, threshold: 60, path: './imgs/buffs/Omni_Guard_Special-top-noborder.data.png' },
      { name: "Enhanced Excalibur Debuff", image: this.Debuffs.enhancedExcaliburDebuff, threshold: 15, path: './imgs/icons/excalibur.png' },
      { name: "Crystal Rain Debuff", image: this.Debuffs.crystalRainMinimal, threshold: 60, path: './imgs/buffs/Crystal_Rain-minimal-noborder.data.png' },
      { name: "Stunned Debuff", image: this.Debuffs.stunnedDebuff, threshold: 60, path: './imgs/buffs/Stunned.data.png' },
      { name: "Sign of Life Debuff", image: this.Debuffs.signOfLifeDebuff, threshold: 20, path: './imgs/buffs/Sign_of_Life-top.data.png' },
      { name: "Powerburst Prevention", image: this.Debuffs.powerburstPrevention, threshold: 20, path: './imgs/buffs/Powerburst_prevention.data.png' },
      { name: "Deathspore Arrows (Buff Bar)", image: this.Debuffs.FeastingSpores, threshold: 18, path: './imgs/buffs/deathspore_arrows.data.png' },

      // --- ULTIMATES ---
      { name: "Berserk", image: this.Ultimates.berserk, threshold: 200, path: './imgs/buffs/Berserk-noborder.data.png' },
      { name: "Deaths Swiftness", image: this.Ultimates.deathsSwiftness, threshold: 270, path: './imgs/buffs/Deaths_Swiftness-top.data.png' },
      { name: "Greater Deaths Swiftness", image: this.Ultimates.greaterDeathsSwiftness, threshold: 450, path: "./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png" },
      { name: "Sunshine", image: this.Ultimates.sunshine, threshold: 500, path: './imgs/buffs/Sunshine-noborder.data.png' },
      { name: "Greater Sunshine", image: this.Ultimates.greaterSunshine, threshold: 100, path: './imgs/buffs/Greater_Sunshine-noborder.data.png' },
      { name: "Living Death", image: this.Ultimates.livingDeath, threshold: 400, path: './imgs/buffs/Living_Death-noborder.data.png' },

      // --- SIGILS ---
      { name: "Limitless", image: this.Sigils.limitless, threshold: 250, path: './imgs/buffs/Limitless-noborder.data.png' },
      { name: "Demon Slayer", image: this.Sigils.demonSlayer, threshold: 400, path: './imgs/buffs/Demon_Slayer-noborder.data.png' },
      { name: "Dragon Slayer", image: this.Sigils.dragonSlayer, threshold: 400, path: './imgs/buffs/Dragon_Slayer-noborder.data.png' },
      { name: "Undead Slayer", image: this.Sigils.undeadSlayer, threshold: 400, path: './imgs/buffs/Undead_Slayer-noborder.data.png' },
      { name: "Ingenuity of the Humans", image: this.Sigils.ingenuityOfTheHumans, threshold: 400, path: './imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png' },
    ];

    this.initialized = true;
  }

  static get buffData() {
    if (!this.initialized) {
      throw new Error('BuffImageRegistry must be initialized before accessing buffData. Call BuffImageRegistry.initialize() first.');
    }
    return this._buffData;
  }

  private static _buffData: Array<{ name: string; image: any; threshold: number; path: string }> = [];
}

