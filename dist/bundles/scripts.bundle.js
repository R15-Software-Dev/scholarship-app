(()=>{"use strict";$((function(){const e=document.querySelector("tab-bar").activeTab;console.log(`Attempting to show panel with id ${e.panelId}`),$(`#${e.panelId}`).show(),$("tab-bar").on("change",(()=>{const e=document.querySelector("tab-bar").activeTab.panelId;$(".tab-panel").hide(),$(`#${e}`).show()}))}))})();