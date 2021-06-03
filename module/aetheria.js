// Import Modules
import { AetheriaActor } from "./actor/actor.js";
import { AetheriaActorSheet } from "./actor/actor-sheet.js";
import { AetheriaItem } from "./item/item.js";
import { AetheriaItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.aetheria = {
    AetheriaActor,
    AetheriaItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @attributes.initiative.ability",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = AetheriaActor;
  CONFIG.Item.entityClass = AetheriaItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("aetheria", AetheriaActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("aetheria", AetheriaItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});