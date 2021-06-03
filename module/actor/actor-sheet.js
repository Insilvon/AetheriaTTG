/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class AetheriaActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["aetheria", "sheet", "actor"],
      template: "systems/aetheria/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "overview" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    for (let attr of Object.values(data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }

    // Prepare items.
    if (this.actor.data.type == 'character') {
      this._prepareCharacterItems(data);
    }

    return data;
  }

  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
  
    // Initialize containers.
    const gear = [];
    const weapons = [];
    const armor = [];
    const prisms = [];
    const abilities = [];
    const speciesAbilities = [];
    let ac = 0;
    let armorWeight = 0;
  
    // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to weapon.
      else if (i.type === 'weapon') {
        weapons.push(i);
      }
      else if (i.type === 'armor') {
        armor.push(i);
        if (item.equipped === 'true') {
          ac += parseInt(item.level, 10);
          armorWeight += parseInt(item.weight, 10);
        }
      }
      else if (i.type === 'prism') {
        prisms.push(i);
      }
      else if (i.type === 'ability') {
        abilities.push(i);
      }
      else if (i.type === 'speciesability') {
        speciesAbilities.push(i);
      }
    }

    armorWeight = Math.floor(armorWeight/3);
    let temp = parseInt(actorData.data.attributes.bonusMove.value);
    temp -= armorWeight;
    temp += 5;
    armorWeight = temp;
    let bonusArmor = parseInt(actorData.data.attributes.bonusArmor.value);
    ac += bonusArmor;

    // Assign and return
    actorData.gear = gear;
    actorData.weapons = weapons;
    actorData.armor = armor;
    actorData.prisms = prisms;
    actorData.totalArmor = ac;
    actorData.armorWeight = parseInt(armorWeight, 10);
    actorData.abilities = abilities;
    actorData.speciesAbilities = speciesAbilities;
    // console.log("We currently see value ", actorData.data.stats.armor.value);
    // console.log("Setting it to ac ", ac);
    // actorData.data.stats.armor.value = ac;
    // console.log(actorData.data.stats.armor.value);
    // actorData.data.stats.armor.max = ac;
  }
  

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolls for ${dataset.label}!` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

}
