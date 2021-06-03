/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class AetheriaActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      switch(key) {
        case "Strength":
          ability.mod = data.charm.cavalier.value;
          break;
        case "Medicine":
          ability.mod = data.charm.healer.value;
          break;
        case "Traps":
          ability.mod = data.charm.archer.value;
          break;
        case "Sneak":
          ability.mod = data.charm.rogue.value;
          break;
        case "Casting":
          ability.mod = data.charm.mage.value;
          break;
        case "Constitution":
          ability.mod = data.charm.cavalier.value;
          break;
        case "Persuasion":
          ability.mod = data.charm.healer.value;
          break;
        case "Survival":
          ability.mod = data.charm.archer.value;
          break;
        case "Agility":
          ability.mod = data.charm.rogue.value;
          break;
        case "Resist_Aff":
          ability.mod = data.charm.mage.value;
          break;
        case "Intimidation":
          ability.mod = data.charm.cavalier.value;
          break;
        case "Deduction":
          ability.mod = data.charm.healer.value;
          break;
        case "Perception":
          ability.mod = data.charm.archer.value;
          break;
        case "Thievery":
          ability.mod = data.charm.rogue.value;
          break;
        case "Inner_Ki":
          ability.mod = data.charm.mage.value;
          break;
      }
    }
     // Make modifications to data here. For example:
     const cav = data.charm.cavalier.value;
     const hea = data.charm.healer.value;
     const arc = data.charm.archer.value;
     const rog = data.charm.rogue.value;
     const mag = data.charm.mage.value;
     const lvl = data.stats.level.value;
     const bonus = data.attributes.bonusCharm.value;
     const available = Math.floor(lvl-cav-hea-arc-rog-mag+bonus);
     data.stats.available_points.value = available;
  }

}