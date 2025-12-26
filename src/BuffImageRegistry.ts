import * as a1lib from 'alt1';
import { BuffData } from './types';

export class BuffImageRegistry {
  private static Buffs: any = null;
  private static Incense: any = null;
  private static Debuffs: any = null;
  private static Ultimates: any = null;
  private static Sigils: any = null;
  private static Target: any = null;
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
      residualSoul: require('./imgs/buffs/Residual_Soul-noborder.data.png'),
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
      familiar: require('./imgs/buffs/familiar-top.data.png'),
      icyChill: require('./imgs/buffs/icy_chill.data.png')
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
      cannon: require('./imgs/buffs/cannon_active-top.data.png'),
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

    this.Target = await a1lib.webpackImages({
      deathMark: require('./imgs/buffs/Death_Mark.data.png'),
      vulnerability: require('./imgs/buffs/Vulnerability_bordered.data.png'),
      bloat: require('./imgs/buffs/Bloated.data.png'),
    }).promise;

    this._buffData = [
      // --- BUFFS ---
      {
        name: "Overload", image: this.Buffs.overloaded, threshold: 300, path: './imgs/icons/overload.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Elder Overload", image: this.Buffs.elderOverload, threshold: 60, path: './imgs/icons/elder_overload.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Supreme Overload", image: this.Buffs.supremeOverloadActive, threshold: 30, path: './imgs/icons/supreme_overload.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Weapon Poison", image: this.Buffs.poisonous, threshold: 300, path: './imgs/icons/weapon_poison.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Darkness", image: this.Buffs.darkness, threshold: 400, path: './imgs/icons/darkness.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Animate Dead", image: this.Buffs.animateDead, threshold: 60, path: './imgs/icons/animate_dead.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "FSOA Spec", image: this.Buffs.fsoaWeaponSpec, threshold: 80, path: './imgs/icons/fsoa_spec.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Time Rift", image: this.Buffs.timeRift, threshold: 450, path: './imgs/icons/time_rift.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Gladiators Rage", image: this.Buffs.gladiatorsRage, threshold: 50, path: './imgs/icons/gladiators_rage.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Necrosis", image: this.Buffs.necrosis, threshold: 150, path: './imgs/icons/necrosis.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: true
      },
      {
        name: "Residual Soul", image: this.Buffs.residualSoul, threshold: 60, path: './imgs/icons/residual_soul.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: true,
        debug: true
      },
      {
        name: "Aura", image: this.Buffs.aura, threshold: 400, path: './imgs/icons/equilibrium_aura.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Bonfire Boost", image: this.Buffs.bonfireBoost, threshold: 400, path: './imgs/icons/bonfire.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Grimoire", image: this.Buffs.grimoire, threshold: 100, path: "./imgs/icons/grimoire.png",
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Lantadyme Incense", image: this.Incense.lantadyme, threshold: 119, path: './imgs/icons/lantadyme_incense_sticks.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Dwarf Weed Incense", image: this.Incense.dwarfWeed, threshold: 150, path: './imgs/icons/dwarf_weed_incense_sticks.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Fellstalk Incense", image: this.Incense.fellstalk, threshold: 150, path: './imgs/icons/fellstalk_weed_incense_sticks.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Kwuarm Incense", image: this.Incense.kwuarm, threshold: 150, path: './imgs/icons/kwuarm_weed_incense_sticks.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Antifire", image: this.Buffs.Antifire, threshold: 225, path: './imgs/icons/antifire.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Aggression Potion", image: this.Buffs.AggressionPotion, threshold: 120, path: './imgs/icons/aggression_potion.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Powder of Protection", image: this.Buffs.PowderOfProtection, threshold: 130, path: './imgs/icons/powder_of_protection.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Powder of Penance", image: this.Buffs.PowderOfPenance, threshold: 130, path: './imgs/icons/powder_of_penance.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Prayer Renewal", image: this.Buffs.prayerRenewActive, threshold: 225, path: './imgs/icons/prayer_renewal.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Death Spark", image: this.Buffs.DeathSpark, threshold: 300, path: './imgs/icons/death_spark.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Balance By Force", image: this.Buffs.balanceByForce, threshold: 30, path: './imgs/icons/balance_by_force.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "BOLG Stacks", image: this.Buffs.perfectEquilibriumNoBorder, threshold: 300, path: './imgs/icons/perfect_equilibrium.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: true
      },
      {
        name: "Anticipation", image: this.Buffs.Anticipation, threshold: 300, path: './imgs/icons/anticipation.png',
        abilityCooldown: 24.6,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Barricade", image: this.Buffs.Barricade, threshold: 300, path: './imgs/icons/barricade.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Devotion", image: this.Buffs.Devotion, threshold: 300, path: './imgs/icons/devotion.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Divert", image: this.Buffs.Divert, threshold: 300, path: './imgs/icons/divert.png',
        abilityCooldown: 30,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Freedom", image: this.Buffs.Freedom, threshold: 300, path: './imgs/icons/freedom.png',
        abilityCooldown: 30,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Immortality", image: this.Buffs.Immortality, threshold: 300, path: './imgs/icons/immortality.png',
        abilityCooldown: 120,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Reflect", image: this.Buffs.Reflect, threshold: 300, path: './imgs/icons/reflect.png',
        abilityCooldown: 30,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Resonance", image: this.Buffs.Resonance, threshold: 300, path: './imgs/icons/resonance.png',
        abilityCooldown: 30,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Split Soul", image: this.Buffs.SplitSoul, threshold: 350, path: './imgs/icons/split_soul.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Threads of Fate", image: this.Buffs.ThreadsOfFate, threshold: 300, path: './imgs/icons/threads_of_fate.png',
        abilityCooldown: 45,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },


      {
        name: "Conjure Skeleton", image: this.Buffs.ConjureSkeleton, threshold: 300, path: './imgs/icons/skeleton_warrior.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Conjure Zombie", image: this.Buffs.ConjureZombie, threshold: 300, path: './imgs/icons/putrid_zombie.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Conjure Ghost", image: this.Buffs.ConjureGhost, threshold: 300, path: './imgs/icons/vengeful_ghost.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Split Soul ECB", image: this.Buffs.SplitSoulECB, threshold: 60, path: './imgs/icons/split_soul_ecb.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Invoke Lord of Bones", image: this.Buffs.InvokeLordOfBones, threshold: 180, path: './imgs/icons/lord_of_bones.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Adren Crit", image: this.Buffs.adrenCrit, threshold: 300, path: './imgs/icons/adren_crit_buff.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Glacial Embrace", image: this.Buffs.glacialEmbrace, threshold: 60, path: './imgs/icons/glacial_embrace.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Blood Tithe", image: this.Buffs.bloodTithe, threshold: 60, path: './imgs/icons/blood_tithe.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },

      // --- DEBUFFS ---
      {
        name: "Ancient Elven Ritual Shard", image: this.Debuffs.elvenRitualShard, threshold: 90, path: './imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Adrenaline Potion Debuff", image: this.Debuffs.adrenalinePotion, threshold: 300, path: './imgs/buffs/Adrenaline_Potion-noborder.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Death Guard Debuff", image: this.Debuffs.deathGraspDebuff, threshold: 90, path: './imgs/icons/death_guard.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Omni Guard Debuff", image: this.Debuffs.deathEssenceDebuff, threshold: 60, path: './imgs/icons/omni_guard.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Enhanced Excalibur Debuff", image: this.Debuffs.enhancedExcaliburDebuff, threshold: 15, path: './imgs/icons/excalibur.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Crystal Rain Debuff", image: this.Debuffs.crystalRainMinimal, threshold: 60, path: './imgs/buffs/Crystal_Rain-minimal-noborder.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Stunned Debuff", image: this.Debuffs.stunnedDebuff, threshold: 60, path: './imgs/buffs/Stunned.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Sign of Life Debuff", image: this.Debuffs.signOfLifeDebuff, threshold: 20, path: './imgs/icons/sign_of_life.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Powerburst Prevention", image: this.Debuffs.powerburstPrevention, threshold: 20, path: './imgs/buffs/Powerburst_prevention.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Deathspore Arrows", image: this.Debuffs.FeastingSpores, threshold: 18, path: './imgs/buffs/deathspore_arrows.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Icy chill",
        image: this.Buffs.icyChill,
        threshold: 29,
        path: './imgs/icons/icy_chill.png',
        hasAbilityCooldown: false,
        abilityCooldown: 0,
        isStack: true,
        isTarget: false,
        //debug: true,
        useAggressiveSearh: true
      },
      {
        name: "Cannon Decay", image: this.Debuffs.cannon, threshold: 120, path: './imgs/icons/cannon.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Familiar", image: this.Buffs.familiar, threshold: 160, path: './imgs/icons/familiar.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },


      // --- ULTIMATES ---
      {
        name: "Berserk", image: this.Ultimates.berserk, threshold: 200, path: './imgs/buffs/Berserk-noborder.data.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Deaths Swiftness", image: this.Ultimates.deathsSwiftness, threshold: 270, path: './imgs/icons/deaths_swiftness.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Greater Deaths Swiftness", image: this.Ultimates.greaterDeathsSwiftness, threshold: 450, path: "./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png",
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Sunshine", image: this.Ultimates.sunshine, threshold: 500, path: './imgs/buffs/Sunshine-noborder.data.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Greater Sunshine", image: this.Ultimates.greaterSunshine, threshold: 100, path: './imgs/buffs/Greater_Sunshine-noborder.data.png',
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: false,
        isStack: false
      },
      {
        name: "Living Death", image: this.Ultimates.livingDeath, threshold: 400, path: './imgs/buffs/Living_Death-noborder.data.png',
        abilityCooldown: 90,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },

      // --- SIGILS ---
      {
        name: "Limitless", image: this.Sigils.limitless, threshold: 250, path: './imgs/buffs/Limitless-noborder.data.png',
        abilityCooldown: 90,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Demon Slayer", image: this.Sigils.demonSlayer, threshold: 400, path: './imgs/buffs/Demon_Slayer-noborder.data.png',
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Dragon Slayer", image: this.Sigils.dragonSlayer, threshold: 400, path: './imgs/buffs/Dragon_Slayer-noborder.data.png',
        debug: false,
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Undead Slayer", image: this.Sigils.undeadSlayer, threshold: 400, path: './imgs/buffs/Undead_Slayer-noborder.data.png',
        debug: false,
        abilityCooldown: 60,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Ingenuity of the Humans", image: this.Sigils.ingenuityOfTheHumans, threshold: 400, path: './imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png',
        debug: false,
        abilityCooldown: 90,
        hasAbilityCooldown: true,
        isTarget: false,
        isStack: false
      },
      {
        name: "Death Mark", image: this.Target.deathMark, threshold: 0, path: './imgs/icons/death_mark.png',
        debug: false,
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: true,
        isStack: false
      },
      {
        name: "Vulnerability", image: this.Target.vulnerability, threshold: 0, path: './imgs/icons/vulnerability.png',
        debug: false,
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: true,
        isStack: false
      },
      {
        name: "Bloat", image: this.Target.bloat, threshold: 0, path: './imgs/icons/bloat.png',
        debug: false,
        abilityCooldown: 0,
        hasAbilityCooldown: false,
        isTarget: true,
        isStack: false
      }
    ];

    this.initialized = true;
  }

  static get buffData() {
    if (!this.initialized) {
      throw new Error('BuffImageRegistry must be initialized before accessing buffData. Call BuffImageRegistry.initialize() first.');
    }
    return this._buffData;
  }

  private static _buffData: Array<BuffData> = [];
}

