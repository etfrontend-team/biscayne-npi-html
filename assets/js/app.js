import { initHeader } from "./header.js";
import { initFooterAccordion } from "./footer.js";
import { initPopularAdventures } from "./popular-adventures.js";

try { initHeader(); } catch (e) { console.error('[header]', e); }
try { initFooterAccordion(); } catch (e) { console.error('[footer]', e); }
try { initPopularAdventures(); } catch (e) { console.error('[popular-adventures]', e); }
