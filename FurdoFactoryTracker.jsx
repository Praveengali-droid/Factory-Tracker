import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Settings,
  ArrowLeft,
  Factory,
  LayoutDashboard,
  FolderOpen,
  Trash2,
  Edit,
  X,
  AlertTriangle,
  Download,
  Upload,
  Calendar,
  User,
  MapPin,
  ChevronUp,
} from "lucide-react";

const STORAGE_KEY = "furdo_tracker_data";

const THEME_STYLE = {
  "--bg-primary": "#FAFAF8",
  "--bg-secondary": "#F0EFEB",
  "--bg-white": "#FFFFFF",
  "--text-primary": "#1A1A18",
  "--text-secondary": "#6B6B65",
  "--text-tertiary": "#9C9C95",
  "--border": "#E0DFD9",
  "--border-strong": "#C5C4BE",
  "--status-gray-bg": "#F0F0EE",
  "--status-gray-text": "#6B6B65",
  "--status-blue-bg": "#E8F0FE",
  "--status-blue-text": "#1A56DB",
  "--status-green-bg": "#E6F4EA",
  "--status-green-text": "#137333",
  "--status-yellow-bg": "#FEF7E0",
  "--status-yellow-text": "#B05E0A",
  "--status-orange-bg": "#FEF0E1",
  "--status-orange-text": "#C4500A",
  "--status-red-bg": "#FDE7E7",
  "--status-red-text": "#C5221F",
  "--accent": "#2D5A27",
  "--accent-hover": "#3D7A34",
  "--accent-light": "#E8F0E6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const ENUMS = {
  projectStatus: [
    { value: "active", label: "Active", color: "green" },
    { value: "on_hold", label: "On Hold", color: "yellow" },
    { value: "completed", label: "Completed", color: "blue" },
  ],
  category: [
    { value: "woodwork", label: "Woodwork" },
    { value: "hardware", label: "Hardware" },
    { value: "glass", label: "Glass" },
    { value: "laminates", label: "Laminates" },
    { value: "accessories", label: "Accessories" },
    { value: "other", label: "Other" },
  ],
  source: [
    { value: "factory", label: "Factory" },
    { value: "market", label: "Market Purchase" },
    { value: "existing_stock", label: "Existing Stock" },
  ],
  materialStatus: [
    { value: "not_checked", label: "Not Checked", color: "gray" },
    { value: "available", label: "Available", color: "green" },
    { value: "to_order", label: "To Order", color: "orange" },
    { value: "ordered", label: "Ordered", color: "blue" },
    { value: "received", label: "Received", color: "green" },
  ],
  productionStatus: [
    { value: "pending", label: "Pending", color: "gray" },
    { value: "in_progress", label: "In Progress", color: "blue" },
    { value: "done", label: "Done", color: "green" },
  ],
  qcStatus: [
    { value: "not_checked", label: "Not Checked", color: "gray" },
    { value: "passed", label: "Passed", color: "green" },
    { value: "failed", label: "Failed", color: "red" },
  ],
  dispatchStatus: [
    { value: "not_ready", label: "Not Ready", color: "gray" },
    { value: "ready", label: "Ready", color: "yellow" },
    { value: "dispatched", label: "Dispatched", color: "blue" },
    { value: "delivered", label: "Delivered", color: "green" },
  ],
  priority: [
    { value: "normal", label: "Normal", color: "gray" },
    { value: "urgent", label: "Urgent", color: "red" },
  ],
  panelType: [
    { value: "side_panel", label: "Side Panel" },
    { value: "back_panel", label: "Back Panel" },
    { value: "top_panel", label: "Top Panel" },
    { value: "bottom_panel", label: "Bottom Panel" },
    { value: "shutter", label: "Shutter" },
    { value: "shelf", label: "Shelf" },
    { value: "skirting", label: "Skirting" },
    { value: "ledge", label: "Ledge" },
    { value: "loft_shutter", label: "Loft Shutter" },
    { value: "cnc_panel", label: "CNC Panel" },
    { value: "other", label: "Other" },
  ],
  snagReason: [
    { value: "add_on", label: "Add On" },
    { value: "damaged_at_site", label: "Damaged at Site" },
    { value: "drawing_error", label: "Drawing Error" },
    { value: "undulations", label: "Undulations" },
    { value: "replacement_due_to_scratches", label: "Replacement Due to Scratches" },
    { value: "size_mismatch", label: "Size Mismatch" },
    { value: "finish_issue", label: "Finish Issue" },
    { value: "material_issue", label: "Material Issue" },
    { value: "other", label: "Other" },
  ],
  rooms: [
    "Kitchen",
    "Bedroom 1",
    "Bedroom 2",
    "Bedroom 3",
    "Living Room",
    "Dining",
    "Bathroom 1",
    "Bathroom 2",
    "Foyer",
    "Study",
    "Utility",
    "Balcony",
    "Other",
  ],
};

const EMPTY_DATA = {
  projects: [],
  snagLists: [],
  snagItems: [],
  operators: ["Operator A", "Operator B"],
  teamMembers: ["Rahul", "Priya", "Meena"],
};

const STATUS_COLOR_MAP = {
  gray: {
    backgroundColor: "var(--status-gray-bg)",
    color: "var(--status-gray-text)",
  },
  blue: {
    backgroundColor: "var(--status-blue-bg)",
    color: "var(--status-blue-text)",
  },
  green: {
    backgroundColor: "var(--status-green-bg)",
    color: "var(--status-green-text)",
  },
  yellow: {
    backgroundColor: "var(--status-yellow-bg)",
    color: "var(--status-yellow-text)",
  },
  orange: {
    backgroundColor: "var(--status-orange-bg)",
    color: "var(--status-orange-text)",
  },
  red: {
    backgroundColor: "var(--status-red-bg)",
    color: "var(--status-red-text)",
  },
};

const NAV_TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderOpen },
  { key: "factory", label: "Factory", icon: Factory },
  { key: "settings", label: "Settings", icon: Settings },
];

const DEFAULT_ITEM_FORM = {
  projectId: "",
  snagListId: "",
  description: "",
  room: "",
  panelType: "",
  panelTypeOther: "",
  height: "",
  width: "",
  thickness: "",
  quantity: "",
  snagReason: "",
  snagReasonOther: "",
  materialSpec: "",
  category: "woodwork",
  source: "factory",
  factoryOperator: "",
  materialStatus: "not_checked",
  productionStatus: "pending",
  qcStatus: "not_checked",
  dispatchStatus: "not_ready",
  priority: "normal",
  dueDate: "",
  remarks: "",
};

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  );
}

function nowIso() {
  return new Date().toISOString();
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayKey() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return toDateInput(date);
}

function daysFromToday(delta) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + delta);
  return toDateInput(date);
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(isoString) {
  if (!isoString) {
    return "just now";
  }
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) {
    return "just now";
  }
  if (mins < 60) {
    return `${mins}m ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function isOverdue(item, today = todayKey()) {
  return Boolean(item.dueDate) && item.dueDate < today && item.dispatchStatus !== "delivered";
}

function normalizeStringList(values = []) {
  const seen = new Set();
  return values
    .map((value) => `${value || ""}`.trim())
    .filter((value) => value.length > 0)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function mergeUniqueStrings(current, additions) {
  return normalizeStringList([...(current || []), ...(additions || [])]);
}

function getEnumOption(field, value) {
  return (ENUMS[field] || []).find((option) => option.value === value);
}

function getEnumLabel(field, value) {
  return getEnumOption(field, value)?.label || value || "Unknown";
}

function getItemPanelTypeLabel(item) {
  if (!item?.panelType) {
    return "Unspecified";
  }
  if (item?.panelType === "other") {
    return item.panelTypeOther || "Other";
  }
  return getEnumLabel("panelType", item?.panelType);
}

function getItemSnagReasonLabel(item) {
  if (!item?.snagReason) {
    return "Unspecified";
  }
  if (item?.snagReason === "other") {
    return item.snagReasonOther || "Other";
  }
  return getEnumLabel("snagReason", item?.snagReason);
}

function formatItemSize(item) {
  const parts = [item?.height, item?.width, item?.thickness].filter(Boolean);
  if (!parts.length) {
    return "Size not set";
  }
  return `${item?.height || "-"} × ${item?.width || "-"} × ${item?.thickness || "-"}`;
}

function getBadgeStyle(field, value) {
  const tone = getEnumOption(field, value)?.color || "gray";
  return STATUS_COLOR_MAP[tone] || STATUS_COLOR_MAP.gray;
}

function progressPercent(done, total) {
  if (!total) {
    return 0;
  }
  return Math.round((done / total) * 100);
}

function makeProjectForm(project) {
  return {
    id: project?.id || "",
    name: project?.name || "",
    clientName: project?.clientName || "",
    siteAddress: project?.siteAddress || "",
    assignedTo: project?.assignedTo || "",
    targetDate: project?.targetDate || "",
    status: project?.status || "active",
    notes: project?.notes || "",
  };
}

function makeSnagListForm(projectId, snagList) {
  return {
    id: snagList?.id || "",
    projectId: snagList?.projectId || projectId || "",
    visitDate: snagList?.visitDate || todayKey(),
    reportedBy: snagList?.reportedBy || "",
    siteNotes: snagList?.siteNotes || "",
  };
}

function makeItemForm(projectId, snagListId, item) {
  return {
    ...DEFAULT_ITEM_FORM,
    id: item?.id || "",
    projectId: item?.projectId || projectId || "",
    snagListId:
      item?.snagListId === null || item?.snagListId === undefined
        ? snagListId || ""
        : item.snagListId,
    description: item?.description || "",
    room: item?.room || "",
    panelType: item?.panelType || "",
    panelTypeOther: item?.panelTypeOther || "",
    height: item?.height || "",
    width: item?.width || "",
    thickness: item?.thickness || "",
    quantity: item?.quantity || "",
    snagReason: item?.snagReason || "",
    snagReasonOther: item?.snagReasonOther || "",
    materialSpec: item?.materialSpec || "",
    category: item?.category || "woodwork",
    source: item?.source || "factory",
    factoryOperator: item?.factoryOperator || "",
    materialStatus: item?.materialStatus || "not_checked",
    productionStatus: item?.productionStatus || "pending",
    qcStatus: item?.qcStatus || "not_checked",
    dispatchStatus: item?.dispatchStatus || "not_ready",
    priority: item?.priority || "normal",
    dueDate: item?.dueDate || "",
    remarks: item?.remarks || "",
  };
}

function normalizeData(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Imported file is not a valid data object.");
  }

  const projects = Array.isArray(raw.projects)
    ? raw.projects.map((project) => ({
        id: project.id || generateId(),
        name: `${project.name || ""}`.trim(),
        clientName: `${project.clientName || ""}`.trim(),
        siteAddress: `${project.siteAddress || ""}`.trim(),
        assignedTo: `${project.assignedTo || ""}`.trim(),
        targetDate: project.targetDate || "",
        status: project.status || "active",
        notes: `${project.notes || ""}`.trim(),
        createdAt: project.createdAt || nowIso(),
        updatedAt: project.updatedAt || nowIso(),
      }))
    : [];

  const projectIds = new Set(projects.map((project) => project.id));

  const snagLists = Array.isArray(raw.snagLists)
    ? raw.snagLists
        .filter((list) => projectIds.has(list.projectId))
        .map((list) => ({
          id: list.id || generateId(),
          projectId: list.projectId,
          visitDate: list.visitDate || todayKey(),
          reportedBy: `${list.reportedBy || ""}`.trim(),
          siteNotes: `${list.siteNotes || ""}`.trim(),
          createdAt: list.createdAt || nowIso(),
        }))
    : [];

  const snagListIds = new Set(snagLists.map((list) => list.id));

  const snagItems = Array.isArray(raw.snagItems)
    ? raw.snagItems
        .filter(
          (item) =>
            projectIds.has(item.projectId) &&
            (!item.snagListId || snagListIds.has(item.snagListId))
        )
        .map((item) => ({
          id: item.id || generateId(),
          projectId: item.projectId,
          snagListId: item.snagListId || null,
          description: `${item.description || ""}`.trim(),
          room: `${item.room || ""}`.trim(),
          panelType: item.panelType || "",
          panelTypeOther: `${item.panelTypeOther || ""}`.trim(),
          height: `${item.height || ""}`.trim(),
          width: `${item.width || ""}`.trim(),
          thickness: `${item.thickness || ""}`.trim(),
          quantity: `${item.quantity || ""}`.trim(),
          snagReason: item.snagReason || "",
          snagReasonOther: `${item.snagReasonOther || ""}`.trim(),
          materialSpec: `${item.materialSpec || ""}`.trim(),
          category: item.category || "woodwork",
          source: item.source || "factory",
          factoryOperator: `${item.factoryOperator || ""}`.trim(),
          materialStatus: item.materialStatus || "not_checked",
          productionStatus: item.productionStatus || "pending",
          qcStatus: item.qcStatus || "not_checked",
          dispatchStatus: item.dispatchStatus || "not_ready",
          priority: item.priority || "normal",
          dueDate: item.dueDate || "",
          remarks: `${item.remarks || ""}`.trim(),
          createdAt: item.createdAt || nowIso(),
          updatedAt: item.updatedAt || nowIso(),
        }))
    : [];

  const importedOperators = Array.isArray(raw.operators) ? raw.operators : [];
  const derivedOperators = snagItems
    .filter((item) => item.source === "factory" && item.factoryOperator)
    .map((item) => item.factoryOperator);
  const operators = mergeUniqueStrings(
    EMPTY_DATA.operators,
    importedOperators.concat(derivedOperators)
  );

  const importedTeam = Array.isArray(raw.teamMembers) ? raw.teamMembers : [];
  const derivedTeam = projects
    .map((project) => project.assignedTo)
    .concat(snagLists.map((list) => list.reportedBy));
  const teamMembers = mergeUniqueStrings(
    EMPTY_DATA.teamMembers,
    importedTeam.concat(derivedTeam)
  );

  return {
    projects,
    snagLists,
    snagItems,
    operators,
    teamMembers,
  };
}

function getSampleItemSpec(description, category, index) {
  const text = description.toLowerCase();
  const defaults = {
    panelType: "other",
    panelTypeOther: "",
    height: "2100",
    width: "600",
    thickness: category === "hardware" ? "18" : "18",
    quantity: `${(index % 2) + 1}`,
    snagReason: index % 3 === 0 ? "add_on" : "damaged_at_site",
    snagReasonOther: "",
    materialSpec: "",
  };

  if (text.includes("back panel")) {
    return {
      ...defaults,
      panelType: "back_panel",
      height: "1050",
      width: "500",
      thickness: "6",
      quantity: "2",
      snagReason: "undulations",
      materialSpec: "MDF + 5133 SD (BSL)",
    };
  }
  if (text.includes("side panel")) {
    return {
      ...defaults,
      panelType: "side_panel",
      height: "2100",
      width: "710",
      thickness: "18",
      quantity: "1",
      materialSpec: "49916 HGL SHV IVORY FROST + OFF WHITE LINER",
    };
  }
  if (text.includes("top panel")) {
    return {
      ...defaults,
      panelType: "top_panel",
      height: "470",
      width: "1585",
      thickness: "18",
      quantity: "1",
      materialSpec: "3521 NGL + 5133 SD",
    };
  }
  if (text.includes("bottom panel")) {
    return {
      ...defaults,
      panelType: "bottom_panel",
      height: "765",
      width: "1990",
      thickness: "18",
      quantity: "1",
      materialSpec: "5133 SD",
    };
  }
  if (text.includes("shutter")) {
    return {
      ...defaults,
      panelType: text.includes("loft") ? "loft_shutter" : "shutter",
      height: text.includes("wardrobe") ? "2000" : "668",
      width: text.includes("wardrobe") ? "403" : "598",
      thickness: "18",
      quantity: text.includes("wardrobe") ? "2" : "1",
      materialSpec: text.includes("wardrobe")
        ? "AR-2007 ADVANCE ACRYLIC"
        : "49949 HGL SH V + OFF WHITE LINER",
    };
  }
  if (text.includes("shelf") || text.includes("shelves")) {
    return {
      ...defaults,
      panelType: "shelf",
      height: "535",
      width: "565",
      thickness: "18",
      quantity: "2",
      snagReason: "add_on",
      materialSpec: "541 SF OLIYVA",
    };
  }
  if (text.includes("skirting")) {
    return {
      ...defaults,
      panelType: "skirting",
      height: "100",
      width: "2100",
      thickness: "25",
      quantity: "3",
      snagReason: "add_on",
      materialSpec: "WOOL WHITE 538 EM + 5133 SD",
    };
  }
  if (text.includes("ledge")) {
    return {
      ...defaults,
      panelType: "ledge",
      height: "As per sketch",
      width: "As per sketch",
      thickness: "34",
      quantity: "2",
      snagReason: "add_on",
      materialSpec: "5425 SUD (BSL)",
    };
  }
  if (text.includes("cnc")) {
    return {
      ...defaults,
      panelType: "cnc_panel",
      height: "1214",
      width: "571",
      thickness: "12",
      quantity: "1",
      snagReason: "damaged_at_site",
      materialSpec: "3515 NGL + 5133 SD",
    };
  }

  return {
    ...defaults,
    materialSpec: category === "laminates" ? "5133 SD + OFF WHITE LINER" : "BWP PLY + MATTE LAMINATE",
  };
}

function createSampleData() {
  const operators = ["Operator A", "Operator B", "Operator C"];
  const teamMembers = ["Rahul", "Priya", "Meena", "Arjun", "Kavya", "Nisha"];
  const createdAt = nowIso();

  const projectA = {
    id: generateId(),
    name: "Sharma Residence",
    clientName: "Amit Sharma",
    siteAddress: "42, Whitefield, Bengaluru",
    assignedTo: "Rahul",
    targetDate: daysFromToday(30),
    status: "active",
    notes: "3BHK full-home interior with factory-fabricated wardrobes and kitchen.",
    createdAt,
    updatedAt: createdAt,
  };
  const projectB = {
    id: generateId(),
    name: "Patel Office Fitout",
    clientName: "Rupal Patel",
    siteAddress: "17, HSR Layout, Bengaluru",
    assignedTo: "Meena",
    targetDate: daysFromToday(18),
    status: "active",
    notes: "Reception, storage wall, and conference room cabinetry.",
    createdAt,
    updatedAt: createdAt,
  };
  const projectC = {
    id: generateId(),
    name: "Kumar Penthouse",
    clientName: "Vikram Kumar",
    siteAddress: "Tower 9, Sarjapur Road, Bengaluru",
    assignedTo: "Priya",
    targetDate: daysFromToday(45),
    status: "on_hold",
    notes: "Waiting on client-approved veneer selection for master bedroom.",
    createdAt,
    updatedAt: createdAt,
  };

  const snagListA1 = {
    id: generateId(),
    projectId: projectA.id,
    visitDate: daysFromToday(-8),
    reportedBy: "Priya",
    siteNotes: "Checked kitchen and bedroom wardrobe alignment.",
    createdAt,
  };
  const snagListA2 = {
    id: generateId(),
    projectId: projectA.id,
    visitDate: daysFromToday(-2),
    reportedBy: "Rahul",
    siteNotes: "Follow-up visit after hinge replacements.",
    createdAt,
  };
  const snagListB1 = {
    id: generateId(),
    projectId: projectB.id,
    visitDate: daysFromToday(-6),
    reportedBy: "Meena",
    siteNotes: "Reception counter polish and meeting room shutters pending.",
    createdAt,
  };
  const snagListB2 = {
    id: generateId(),
    projectId: projectB.id,
    visitDate: daysFromToday(-1),
    reportedBy: "Arjun",
    siteNotes: "QC round ahead of dispatch planning.",
    createdAt,
  };
  const snagListC1 = {
    id: generateId(),
    projectId: projectC.id,
    visitDate: daysFromToday(-10),
    reportedBy: "Kavya",
    siteNotes: "Master wardrobe veneer mismatch and study desk scratches.",
    createdAt,
  };

  const items = [
    {
      id: generateId(),
      projectId: projectA.id,
      snagListId: snagListA1.id,
      description: "Kitchen upper cabinet left panel warped",
      room: "Kitchen",
      category: "woodwork",
      source: "factory",
      factoryOperator: "Operator A",
      materialStatus: "ordered",
      productionStatus: "in_progress",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "urgent",
      dueDate: daysFromToday(-1),
      remarks: "Laminate SF-204 needed to match existing finish.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectA.id,
      snagListId: snagListA1.id,
      description: "Bedroom 1 wardrobe shutter hinge replacement",
      room: "Bedroom 1",
      category: "hardware",
      source: "market",
      factoryOperator: "",
      materialStatus: "available",
      productionStatus: "done",
      qcStatus: "passed",
      dispatchStatus: "ready",
      priority: "normal",
      dueDate: daysFromToday(2),
      remarks: "Can move with next delivery batch.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectA.id,
      snagListId: snagListA2.id,
      description: "Dining crockery shutter gap adjustment",
      room: "Dining",
      category: "woodwork",
      source: "factory",
      factoryOperator: "Operator B",
      materialStatus: "received",
      productionStatus: "done",
      qcStatus: "passed",
      dispatchStatus: "dispatched",
      priority: "normal",
      dueDate: daysFromToday(1),
      remarks: "Dispatch on same vehicle as pantry handle kit.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectA.id,
      snagListId: snagListA2.id,
      description: "Utility loft support bracket reinforcement",
      room: "Utility",
      category: "hardware",
      source: "existing_stock",
      factoryOperator: "",
      materialStatus: "available",
      productionStatus: "pending",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "normal",
      dueDate: daysFromToday(5),
      remarks: "",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectA.id,
      snagListId: null,
      description: "Living room TV unit veneer patch touch-up",
      room: "Living Room",
      category: "laminates",
      source: "factory",
      factoryOperator: "",
      materialStatus: "to_order",
      productionStatus: "pending",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "urgent",
      dueDate: daysFromToday(3),
      remarks: "Pending operator assignment.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectB.id,
      snagListId: snagListB1.id,
      description: "Reception counter skirting laminate edge band",
      room: "Living Room",
      category: "laminates",
      source: "factory",
      factoryOperator: "Operator B",
      materialStatus: "received",
      productionStatus: "in_progress",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "urgent",
      dueDate: daysFromToday(-2),
      remarks: "Install team blocked until edge band arrives.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectB.id,
      snagListId: snagListB1.id,
      description: "Meeting room shutter soft-close channel",
      room: "Study",
      category: "hardware",
      source: "market",
      factoryOperator: "",
      materialStatus: "ordered",
      productionStatus: "pending",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "normal",
      dueDate: daysFromToday(4),
      remarks: "Vendor promised dispatch tomorrow.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectB.id,
      snagListId: snagListB1.id,
      description: "Storage wall pull handle alignment",
      room: "Study",
      category: "accessories",
      source: "factory",
      factoryOperator: "Operator C",
      materialStatus: "available",
      productionStatus: "done",
      qcStatus: "failed",
      dispatchStatus: "ready",
      priority: "normal",
      dueDate: daysFromToday(1),
      remarks: "QC wants finish cleaned before loading.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectB.id,
      snagListId: snagListB2.id,
      description: "Conference credenza glass shutter replacement",
      room: "Study",
      category: "glass",
      source: "factory",
      factoryOperator: "Operator A",
      materialStatus: "to_order",
      productionStatus: "pending",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "urgent",
      dueDate: daysFromToday(6),
      remarks: "Toughened glass sample awaiting client sign-off.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectB.id,
      snagListId: snagListB2.id,
      description: "Pantry base cabinet toe-kick repaint",
      room: "Kitchen",
      category: "woodwork",
      source: "factory",
      factoryOperator: "Operator C",
      materialStatus: "available",
      productionStatus: "done",
      qcStatus: "passed",
      dispatchStatus: "delivered",
      priority: "normal",
      dueDate: daysFromToday(-4),
      remarks: "Completed on-site.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectC.id,
      snagListId: snagListC1.id,
      description: "Master wardrobe veneer mismatch on drawer fronts",
      room: "Bedroom 1",
      category: "laminates",
      source: "factory",
      factoryOperator: "Operator A",
      materialStatus: "ordered",
      productionStatus: "in_progress",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "urgent",
      dueDate: daysFromToday(8),
      remarks: "Hold dispatch until client final veneer approval.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectC.id,
      snagListId: snagListC1.id,
      description: "Study desk cable grommet cutout finish",
      room: "Study",
      category: "woodwork",
      source: "factory",
      factoryOperator: "Operator B",
      materialStatus: "received",
      productionStatus: "done",
      qcStatus: "passed",
      dispatchStatus: "ready",
      priority: "normal",
      dueDate: daysFromToday(10),
      remarks: "",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectC.id,
      snagListId: null,
      description: "Balcony storage shutter magnet catch missing",
      room: "Balcony",
      category: "hardware",
      source: "market",
      factoryOperator: "",
      materialStatus: "to_order",
      productionStatus: "pending",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "normal",
      dueDate: daysFromToday(12),
      remarks: "Low priority until site handover resumes.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectC.id,
      snagListId: null,
      description: "Foyer shoe unit handle replacement",
      room: "Foyer",
      category: "accessories",
      source: "existing_stock",
      factoryOperator: "",
      materialStatus: "available",
      productionStatus: "done",
      qcStatus: "passed",
      dispatchStatus: "delivered",
      priority: "normal",
      dueDate: daysFromToday(-3),
      remarks: "Closed in prior visit.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: generateId(),
      projectId: projectB.id,
      snagListId: snagListB2.id,
      description: "Reception logo panel edge polish",
      room: "Living Room",
      category: "glass",
      source: "factory",
      factoryOperator: "Operator C",
      materialStatus: "available",
      productionStatus: "in_progress",
      qcStatus: "not_checked",
      dispatchStatus: "not_ready",
      priority: "normal",
      dueDate: daysFromToday(7),
      remarks: "",
      createdAt,
      updatedAt: createdAt,
    },
  ];

  return {
    projects: [projectA, projectB, projectC],
    snagLists: [snagListA1, snagListA2, snagListB1, snagListB2, snagListC1],
    snagItems: items.map((item, index) => ({
      ...getSampleItemSpec(item.description, item.category, index),
      ...item,
    })),
    operators,
    teamMembers,
  };
}

function dataReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return normalizeData(action.payload);
    case "REPLACE_ALL":
      return normalizeData(action.payload);
    case "LOAD_SAMPLE":
      return createSampleData();
    case "ADD_PROJECT": {
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        teamMembers: mergeUniqueStrings(state.teamMembers, [action.payload.assignedTo]),
      };
    }
    case "UPDATE_PROJECT": {
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
        teamMembers: mergeUniqueStrings(state.teamMembers, [action.payload.assignedTo]),
      };
    }
    case "DELETE_PROJECT": {
      const projectId = action.payload;
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== projectId),
        snagLists: state.snagLists.filter((list) => list.projectId !== projectId),
        snagItems: state.snagItems.filter((item) => item.projectId !== projectId),
      };
    }
    case "ADD_SNAG_LIST": {
      return {
        ...state,
        snagLists: [action.payload, ...state.snagLists],
        teamMembers: mergeUniqueStrings(state.teamMembers, [action.payload.reportedBy]),
      };
    }
    case "UPDATE_SNAG_LIST": {
      return {
        ...state,
        snagLists: state.snagLists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        ),
        teamMembers: mergeUniqueStrings(state.teamMembers, [action.payload.reportedBy]),
      };
    }
    case "DELETE_SNAG_LIST": {
      const snagListId = action.payload;
      return {
        ...state,
        snagLists: state.snagLists.filter((list) => list.id !== snagListId),
        snagItems: state.snagItems.filter((item) => item.snagListId !== snagListId),
      };
    }
    case "ADD_SNAG_ITEM": {
      const operator =
        action.payload.source === "factory" ? action.payload.factoryOperator : "";
      return {
        ...state,
        snagItems: [action.payload, ...state.snagItems],
        operators: mergeUniqueStrings(state.operators, [operator]),
      };
    }
    case "UPDATE_SNAG_ITEM": {
      const operator =
        action.payload.source === "factory" ? action.payload.factoryOperator : "";
      return {
        ...state,
        snagItems: state.snagItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        operators: mergeUniqueStrings(state.operators, [operator]),
      };
    }
    case "DELETE_SNAG_ITEM": {
      return {
        ...state,
        snagItems: state.snagItems.filter((item) => item.id !== action.payload),
      };
    }
    case "ADD_OPERATOR":
      return {
        ...state,
        operators: mergeUniqueStrings(state.operators, [action.payload]),
      };
    case "UPDATE_OPERATOR": {
      const { previousName, nextName } = action.payload;
      return {
        ...state,
        operators: normalizeStringList(
          state.operators.map((name) => (name === previousName ? nextName : name))
        ),
        snagItems: state.snagItems.map((item) =>
          item.factoryOperator === previousName
            ? { ...item, factoryOperator: nextName, updatedAt: nowIso() }
            : item
        ),
      };
    }
    case "DELETE_OPERATOR":
      return {
        ...state,
        operators: state.operators.filter((name) => name !== action.payload),
      };
    case "ADD_TEAM_MEMBER":
      return {
        ...state,
        teamMembers: mergeUniqueStrings(state.teamMembers, [action.payload]),
      };
    case "UPDATE_TEAM_MEMBER": {
      const { previousName, nextName } = action.payload;
      return {
        ...state,
        teamMembers: normalizeStringList(
          state.teamMembers.map((name) => (name === previousName ? nextName : name))
        ),
        projects: state.projects.map((project) =>
          project.assignedTo === previousName
            ? { ...project, assignedTo: nextName, updatedAt: nowIso() }
            : project
        ),
        snagLists: state.snagLists.map((list) =>
          list.reportedBy === previousName ? { ...list, reportedBy: nextName } : list
        ),
      };
    }
    case "DELETE_TEAM_MEMBER":
      return {
        ...state,
        teamMembers: state.teamMembers.filter((name) => name !== action.payload),
      };
    default:
      return state;
  }
}

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function SummaryCard({ label, value, hint, tone = "gray", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 1px 2px rgba(26,26,24,0.04)",
      }}
    >
      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="mt-2 text-xs" style={STATUS_COLOR_MAP[tone] || STATUS_COLOR_MAP.gray}>
        <span className="rounded px-2 py-1">{hint}</span>
      </div>
    </button>
  );
}

function EmptyState({ title, message, primaryAction, secondaryAction }) {
  return (
    <div
      className="rounded-xl border border-dashed p-10 text-center"
      style={{
        borderColor: "var(--border-strong)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  );
}

function SectionShell({ title, actions, children }) {
  return (
    <section
      className="rounded-xl border bg-white"
      style={{ borderColor: "var(--border)", boxShadow: "0 1px 2px rgba(26,26,24,0.04)" }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-3"
        style={{ borderColor: "var(--border)" }}
      >
        <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function SearchField({ value, onChange, placeholder = "Search..." }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2"
      style={{ borderColor: "var(--border)" }}
    >
      <Search size={16} style={{ color: "var(--text-tertiary)" }} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent text-sm outline-none"
        style={{ color: "var(--text-primary)" }}
      />
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  allLabel = "All",
  includeAll = false,
}) {
  const hasAll = options.some((option) => option.value === "all");
  const selectOptions =
    includeAll && !hasAll ? [{ value: "all", label: allLabel }, ...options] : options;

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={classNames(
        "rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2",
        className
      )}
      style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {selectOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function CheckboxField({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border"
      />
      {label}
    </label>
  );
}

function FilterChips({ chips, onClearAll }) {
  const active = chips.filter(Boolean);
  if (!active.length) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {active.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
          style={{
            backgroundColor: "var(--accent-light)",
            color: "var(--accent)",
          }}
        >
          {chip.label}
          <X size={12} />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs underline"
        style={{ color: "var(--text-secondary)" }}
      >
        Clear all filters
      </button>
    </div>
  );
}

function StatusBadge({
  field,
  value,
  onClick,
  className = "",
  interactive = true,
}) {
  const style = getBadgeStyle(field, value);
  const content = (
    <>
      {getEnumLabel(field, value)}
      {interactive ? <ChevronDown size={12} /> : null}
    </>
  );

  if (!interactive) {
    return (
      <span
        className={classNames(
          "inline-flex min-h-[32px] items-center gap-1 rounded px-2 py-1 text-[11px] font-medium uppercase tracking-wide",
          className
        )}
        style={style}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "inline-flex min-h-[32px] items-center gap-1 rounded px-2 py-1 text-[11px] font-medium uppercase tracking-wide",
        className
      )}
      style={style}
    >
      {content}
    </button>
  );
}

function EditableBadge({
  field,
  value,
  options,
  isOpen,
  onOpen,
  onClose,
  onChange,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleMouseDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={containerRef}
      className={classNames("relative inline-flex", className.includes("w-full") ? "w-full" : "")}
      onClick={(event) => event.stopPropagation()}
    >
      <StatusBadge
        field={field}
        value={value}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        className={className}
      />
      {isOpen ? (
        <div
          className="absolute left-0 top-full z-20 mt-1 min-w-full rounded-lg border p-1 shadow-lg"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-white)",
            boxShadow: "0 8px 24px rgba(26,26,24,0.12)",
          }}
        >
          <div className="flex min-w-[140px] flex-col gap-1">
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    onClose();
                  }}
                  className="rounded-md px-1 py-1 text-left"
                  style={{
                    backgroundColor: selected ? "var(--bg-secondary)" : "transparent",
                  }}
                >
                  <StatusBadge
                    field={field}
                    value={option.value}
                    interactive={false}
                    className="w-full justify-between"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DueDateLabel({ item, today }) {
  const overdue = isOverdue(item, today);
  return (
    <div
      className={classNames("inline-flex items-center gap-1 text-sm", overdue && "font-medium")}
      style={{ color: overdue ? "var(--status-red-text)" : "var(--text-primary)" }}
    >
      <Calendar size={14} />
      {item.dueDate ? formatDate(item.dueDate) : "No due date"}
      {overdue ? <AlertTriangle size={14} /> : null}
    </div>
  );
}

function Modal({ title, isOpen, onClose, children, footer }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const panel = document.querySelector("[data-modal-panel='true']");
    const focusables = panel
      ? Array.from(
          panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => !element.disabled)
      : [];

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      first?.focus();
    }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab" && focusables.length > 1) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-3 py-6 sm:items-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        data-modal-panel="true"
        className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-2xl border bg-white sm:rounded-2xl"
        style={{ borderColor: "var(--border)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer ? (
          <div
            className="flex flex-wrap items-center justify-end gap-3 border-t px-5 py-4"
            style={{ borderColor: "var(--border)" }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ConfirmModal({ state, onCancel, onConfirm, onInputChange }) {
  return (
    <Modal
      isOpen={Boolean(state)}
      onClose={onCancel}
      title={state?.title || "Confirm action"}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={state?.requiresText && state.inputValue !== state.expectedText}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor:
                state?.tone === "danger" ? "var(--status-red-text)" : "var(--accent)",
            }}
          >
            {state?.confirmLabel || "Confirm"}
          </button>
        </>
      }
    >
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {state?.message}
      </p>
      {state?.requiresText ? (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Type {state.expectedText} to continue
          </label>
          <input
            value={state.inputValue || ""}
            onChange={(event) => onInputChange(event.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      ) : null}
    </Modal>
  );
}

function InputLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
      {children}
      {required ? " *" : ""}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={classNames("w-full rounded-lg border px-3 py-2 text-sm outline-none", props.className)}
      style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={classNames("w-full rounded-lg border px-3 py-2 text-sm outline-none", props.className)}
      style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
    />
  );
}

function ProjectFormModal({ modal, onClose, onChange, onSave, teamMembers }) {
  const form = modal?.form || makeProjectForm();
  return (
    <Modal
      isOpen={modal?.type === "projectForm"}
      onClose={onClose}
      title={modal?.mode === "edit" ? "Edit Project" : "New Project"}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {modal?.mode === "edit" ? "Save Changes" : "Save Project"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {modal?.error ? (
          <div
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--status-red-text)",
              backgroundColor: "var(--status-red-bg)",
              color: "var(--status-red-text)",
            }}
          >
            {modal.error}
          </div>
        ) : null}
        <div>
          <InputLabel required>Project Name</InputLabel>
          <TextInput value={form.name} onChange={(event) => onChange("name", event.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <InputLabel>Client Name</InputLabel>
            <TextInput
              value={form.clientName}
              onChange={(event) => onChange("clientName", event.target.value)}
            />
          </div>
          <div>
            <InputLabel>Assigned To</InputLabel>
            <TextInput
              list="team-member-options"
              value={form.assignedTo}
              onChange={(event) => onChange("assignedTo", event.target.value)}
            />
          </div>
        </div>
        <div>
          <InputLabel>Site Address</InputLabel>
          <TextArea
            rows={3}
            value={form.siteAddress}
            onChange={(event) => onChange("siteAddress", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <InputLabel>Target Date</InputLabel>
            <TextInput
              type="date"
              value={form.targetDate}
              onChange={(event) => onChange("targetDate", event.target.value)}
            />
          </div>
          <div>
            <InputLabel>Status</InputLabel>
            <SelectField
              value={form.status}
              onChange={(value) => onChange("status", value)}
              options={ENUMS.projectStatus}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <InputLabel>Notes</InputLabel>
          <TextArea rows={4} value={form.notes} onChange={(event) => onChange("notes", event.target.value)} />
        </div>
        <datalist id="team-member-options">
          {teamMembers.map((member) => (
            <option key={member} value={member} />
          ))}
        </datalist>
      </div>
    </Modal>
  );
}

function SnagListFormModal({ modal, onClose, onChange, onSave, teamMembers }) {
  const form = modal?.form || makeSnagListForm();
  return (
    <Modal
      isOpen={modal?.type === "snagListForm"}
      onClose={onClose}
      title={modal?.mode === "edit" ? "Edit Snag List" : "Add Snag List"}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {modal?.mode === "edit" ? "Save Changes" : "Save Snag List"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {modal?.error ? (
          <div
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--status-red-text)",
              backgroundColor: "var(--status-red-bg)",
              color: "var(--status-red-text)",
            }}
          >
            {modal.error}
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <InputLabel required>Visit Date</InputLabel>
            <TextInput
              type="date"
              value={form.visitDate}
              onChange={(event) => onChange("visitDate", event.target.value)}
            />
          </div>
          <div>
            <InputLabel required>Reported By</InputLabel>
            <TextInput
              list="team-member-options"
              value={form.reportedBy}
              onChange={(event) => onChange("reportedBy", event.target.value)}
            />
          </div>
        </div>
        <div>
          <InputLabel>Site Notes</InputLabel>
          <TextArea
            rows={4}
            value={form.siteNotes}
            onChange={(event) => onChange("siteNotes", event.target.value)}
          />
        </div>
        <datalist id="team-member-options">
          {teamMembers.map((member) => (
            <option key={member} value={member} />
          ))}
        </datalist>
      </div>
    </Modal>
  );
}

function SnagItemFormModal({
  modal,
  onClose,
  onChange,
  onSave,
  onToggleDetails,
  operators,
}) {
  const form = modal?.form || makeItemForm();
  const showDetails = modal?.showDetails || modal?.mode === "edit";
  return (
    <Modal
      isOpen={modal?.type === "snagItemForm"}
      onClose={onClose}
      title={modal?.mode === "edit" ? "Edit Snag Item" : "Add Snag Item"}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {modal?.mode === "edit" ? "Save Item" : "Save Item"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {modal?.error ? (
          <div
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--status-red-text)",
              backgroundColor: "var(--status-red-bg)",
              color: "var(--status-red-text)",
            }}
          >
            {modal.error}
          </div>
        ) : null}
        <div>
          <InputLabel required>Description</InputLabel>
          <TextArea
            rows={3}
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <InputLabel>Room</InputLabel>
            <TextInput
              list="room-options"
              value={form.room}
              onChange={(event) => onChange("room", event.target.value)}
            />
          </div>
          <div>
            <InputLabel required>Panel Type</InputLabel>
            <SelectField
              value={form.panelType}
              onChange={(value) => onChange("panelType", value)}
              options={ENUMS.panelType}
              className="w-full"
              placeholder="Select panel type"
            />
          </div>
        </div>
        {form.panelType === "other" ? (
          <div>
            <InputLabel required>Other Panel Type</InputLabel>
            <TextInput
              value={form.panelTypeOther}
              onChange={(event) => onChange("panelTypeOther", event.target.value)}
              placeholder="Enter custom panel type"
            />
          </div>
        ) : null}
        <div>
          <InputLabel required>Size (H x W x T)</InputLabel>
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput
              value={form.height}
              onChange={(event) => onChange("height", event.target.value)}
              placeholder="Height"
            />
            <TextInput
              value={form.width}
              onChange={(event) => onChange("width", event.target.value)}
              placeholder="Width"
            />
            <TextInput
              value={form.thickness}
              onChange={(event) => onChange("thickness", event.target.value)}
              placeholder="Thickness"
            />
          </div>
          <div className="mt-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
            Format: Height x Width x Thickness
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <InputLabel required>Qty</InputLabel>
            <TextInput
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) => onChange("quantity", event.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <InputLabel required>Snag Reason</InputLabel>
            <SelectField
              value={form.snagReason}
              onChange={(value) => onChange("snagReason", value)}
              options={ENUMS.snagReason}
              className="w-full"
              placeholder="Select snag reason"
            />
          </div>
          <div>
            <InputLabel>Priority</InputLabel>
            <SelectField
              value={form.priority}
              onChange={(value) => onChange("priority", value)}
              options={ENUMS.priority}
              className="w-full"
            />
          </div>
          <div>
            <InputLabel>Due Date</InputLabel>
            <TextInput
              type="date"
              value={form.dueDate}
              onChange={(event) => onChange("dueDate", event.target.value)}
            />
          </div>
        </div>
        {form.snagReason === "other" ? (
          <div>
            <InputLabel required>Other Snag Reason</InputLabel>
            <TextInput
              value={form.snagReasonOther}
              onChange={(event) => onChange("snagReasonOther", event.target.value)}
              placeholder="Enter custom snag reason"
            />
          </div>
        ) : null}
        <div>
          <InputLabel>Snag List</InputLabel>
          <select
            value={form.snagListId || ""}
            onChange={(event) => onChange("snagListId", event.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <option value="">Ungrouped</option>
            {(modal?.snagListOptions || []).map((option) => (
              <option key={option.id} value={option.id}>
                {formatDate(option.visitDate)} · {option.reportedBy || "Unknown"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onToggleDetails}
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showDetails ? "Less Details" : "More Details"}
        </button>
        {showDetails ? (
          <div
            className="space-y-4 rounded-lg border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <InputLabel>Material Spec</InputLabel>
                <TextInput
                  value={form.materialSpec}
                  onChange={(event) => onChange("materialSpec", event.target.value)}
                  placeholder="Example: MDF + 5133 SD (BSL)"
                />
              </div>
              <div>
                <InputLabel>Category</InputLabel>
                <SelectField
                  value={form.category}
                  onChange={(value) => onChange("category", value)}
                  options={ENUMS.category}
                  className="w-full"
                />
              </div>
              <div>
                <InputLabel>Source</InputLabel>
                <SelectField
                  value={form.source}
                  onChange={(value) => onChange("source", value)}
                  options={ENUMS.source}
                  className="w-full"
                />
              </div>
            </div>
            {form.source === "factory" ? (
              <div>
                <InputLabel>Factory Operator</InputLabel>
                <TextInput
                  list="operator-options"
                  value={form.factoryOperator}
                  onChange={(event) => onChange("factoryOperator", event.target.value)}
                />
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <InputLabel>Material Status</InputLabel>
                <SelectField
                  value={form.materialStatus}
                  onChange={(value) => onChange("materialStatus", value)}
                  options={ENUMS.materialStatus}
                  className="w-full"
                />
              </div>
              <div>
                <InputLabel>Production Status</InputLabel>
                <SelectField
                  value={form.productionStatus}
                  onChange={(value) => onChange("productionStatus", value)}
                  options={ENUMS.productionStatus}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <InputLabel>QC Status</InputLabel>
                <SelectField
                  value={form.qcStatus}
                  onChange={(value) => onChange("qcStatus", value)}
                  options={ENUMS.qcStatus}
                  className="w-full"
                />
              </div>
              <div>
                <InputLabel>Dispatch Status</InputLabel>
                <SelectField
                  value={form.dispatchStatus}
                  onChange={(value) => onChange("dispatchStatus", value)}
                  options={ENUMS.dispatchStatus}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <InputLabel>Remarks</InputLabel>
              <TextArea
                rows={4}
                value={form.remarks}
                onChange={(event) => onChange("remarks", event.target.value)}
              />
            </div>
          </div>
        ) : null}
        <datalist id="room-options">
          {ENUMS.rooms.map((room) => (
            <option key={room} value={room} />
          ))}
        </datalist>
        <datalist id="operator-options">
          {operators.map((operator) => (
            <option key={operator} value={operator} />
          ))}
        </datalist>
      </div>
    </Modal>
  );
}

function SimpleEntityModal({ modal, onClose, onChange, onSave }) {
  const entityLabel = modal?.entityLabel || "Item";
  return (
    <Modal
      isOpen={modal?.type === "entityForm"}
      onClose={onClose}
      title={`${modal?.mode === "edit" ? "Edit" : "Add"} ${entityLabel}`}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Save
          </button>
        </>
      }
    >
      {modal?.error ? (
        <div
          className="mb-4 rounded-lg border px-3 py-2 text-sm"
          style={{
            borderColor: "var(--status-red-text)",
            backgroundColor: "var(--status-red-bg)",
            color: "var(--status-red-text)",
          }}
        >
          {modal.error}
        </div>
      ) : null}
      <InputLabel required>{entityLabel} Name</InputLabel>
      <TextInput
        value={modal?.form?.name || ""}
        onChange={(event) => onChange("name", event.target.value)}
      />
    </Modal>
  );
}

function NavigationBar({ activeTab, onChange }) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-30 border-b"
      style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
          >
            <Factory size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Furdo Tracker
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Factory snag pipeline
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  backgroundColor: active ? "var(--accent-light)" : "transparent",
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function DashboardScreen({
  summary,
  items,
  filters,
  searchInput,
  setSearchInput,
  setFilters,
  onClearFilters,
  openEditorKey,
  setOpenEditorKey,
  onUpdateItemStatus,
  onOpenProject,
  onNewProject,
  onLoadSampleData,
  onClearAll,
  today,
}) {
  const chips = [
    filters.dispatchStatus !== "all" && {
      key: "dispatch",
      label: `Status: ${getEnumLabel("dispatchStatus", filters.dispatchStatus)}`,
      onRemove: () => setFilters((current) => ({ ...current, dispatchStatus: "all" })),
    },
    filters.priority !== "all" && {
      key: "priority",
      label: `Priority: ${getEnumLabel("priority", filters.priority)}`,
      onRemove: () => setFilters((current) => ({ ...current, priority: "all" })),
    },
    filters.operator !== "all" && {
      key: "operator",
      label: `Operator: ${filters.operator}`,
      onRemove: () => setFilters((current) => ({ ...current, operator: "all" })),
    },
    filters.materialGroup !== "all" && {
      key: "material",
      label: "Waiting on material",
      onRemove: () => setFilters((current) => ({ ...current, materialGroup: "all" })),
    },
    filters.overdue && {
      key: "overdue",
      label: "Overdue only",
      onRemove: () => setFilters((current) => ({ ...current, overdue: false })),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active Projects"
          value={summary.activeProjects}
          hint="Projects in motion"
          tone="green"
          onClick={summary.onActiveProjectsClick}
        />
        <SummaryCard
          label="Overdue Items"
          value={summary.overdueItems}
          hint="Needs follow-up"
          tone="red"
          onClick={summary.onOverdueClick}
        />
        <SummaryCard
          label="Waiting on Material"
          value={summary.waitingOnMaterial}
          hint="To order or ordered"
          tone="orange"
          onClick={summary.onWaitingClick}
        />
        <SummaryCard
          label="Ready to Dispatch"
          value={summary.readyToDispatch}
          hint="Dispatch planning"
          tone="yellow"
          onClick={summary.onReadyClick}
        />
      </div>

      <SectionShell
        title="All Snag Items"
        actions={
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Sorted by due date
          </span>
        }
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.8fr))]">
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search project, item, room, or remarks"
          />
          <SelectField
            value={filters.dispatchStatus}
            onChange={(value) => setFilters((current) => ({ ...current, dispatchStatus: value }))}
            options={ENUMS.dispatchStatus}
            className="w-full"
            allLabel="All statuses"
            includeAll
          />
          <SelectField
            value={filters.priority}
            onChange={(value) => setFilters((current) => ({ ...current, priority: value }))}
            options={ENUMS.priority}
            className="w-full"
            allLabel="All priorities"
            includeAll
          />
          <SelectField
            value={filters.operator}
            onChange={(value) => setFilters((current) => ({ ...current, operator: value }))}
            options={summary.operatorOptions}
            className="w-full"
            allLabel="All operators"
            includeAll
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <CheckboxField
            checked={filters.overdue}
            onChange={(value) => setFilters((current) => ({ ...current, overdue: value }))}
            label="Show overdue only"
          />
        </div>

        <FilterChips chips={chips} onClearAll={onClearFilters} />

        {!summary.hasData ? (
          <div className="mt-6">
            <EmptyState
              title="No project data yet"
              message="Create your first project or load sample data to start tracking snag items across factory and site workflows."
              primaryAction={
                <button
                  type="button"
                  onClick={onNewProject}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Create first project
                </button>
              }
              secondaryAction={
                <button
                  type="button"
                  onClick={onLoadSampleData}
                  className="rounded-lg border px-4 py-2 text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  Load sample data
                </button>
              }
            />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No items match your filters"
              message="Try adjusting the current filters or clear them to see the full backlog."
              primaryAction={
                <button
                  type="button"
                  onClick={onClearAll}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Clear all filters
                </button>
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-5 hidden overflow-x-auto lg:block">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                    {[
                      "Project",
                      "Item",
                      "Room",
                      "Panel Type",
                      "Size (H x W x T)",
                      "Qty",
                      "Reason",
                      "Material",
                      "Production",
                      "QC",
                      "Dispatch",
                      "Due Date",
                      "Priority",
                    ].map((label) => (
                      <th
                        key={label}
                        className="px-3 py-3 text-xs font-medium uppercase tracking-wide"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, index) => {
                    const overdue = isOverdue(row, today);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => onOpenProject(row.projectId, row.id)}
                        className="cursor-pointer border-b transition hover:bg-stone-50"
                        style={{
                          borderColor: "var(--border)",
                          backgroundColor:
                            overdue
                              ? "rgba(253,231,231,0.45)"
                              : index % 2 === 0
                                ? "var(--bg-white)"
                                : "var(--bg-primary)",
                          boxShadow: overdue ? "inset 3px 0 0 #C5221F" : "none",
                        }}
                      >
                        <td className="px-3 py-3">
                          <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                            {row.projectName}
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {row.projectAssignedTo || "Unassigned"}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                            {row.description}
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {row.materialSpec || row.remarks || "No material details"}
                          </div>
                        </td>
                        <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>
                          {row.room || "Unspecified"}
                        </td>
                        <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>
                          {getItemPanelTypeLabel(row)}
                        </td>
                        <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>
                          {formatItemSize(row)}
                        </td>
                        <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>
                          {row.quantity || "-"}
                        </td>
                        <td className="px-3 py-3" style={{ color: "var(--text-primary)" }}>
                          {getItemSnagReasonLabel(row)}
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="materialStatus"
                            value={row.materialStatus}
                            options={ENUMS.materialStatus}
                            isOpen={openEditorKey === `dashboard:${row.id}:materialStatus`}
                            onOpen={() => setOpenEditorKey(`dashboard:${row.id}:materialStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) =>
                              onUpdateItemStatus(row.id, "materialStatus", nextValue)
                            }
                          />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="productionStatus"
                            value={row.productionStatus}
                            options={ENUMS.productionStatus}
                            isOpen={openEditorKey === `dashboard:${row.id}:productionStatus`}
                            onOpen={() => setOpenEditorKey(`dashboard:${row.id}:productionStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) =>
                              onUpdateItemStatus(row.id, "productionStatus", nextValue)
                            }
                          />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="qcStatus"
                            value={row.qcStatus}
                            options={ENUMS.qcStatus}
                            isOpen={openEditorKey === `dashboard:${row.id}:qcStatus`}
                            onOpen={() => setOpenEditorKey(`dashboard:${row.id}:qcStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) => onUpdateItemStatus(row.id, "qcStatus", nextValue)}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="dispatchStatus"
                            value={row.dispatchStatus}
                            options={ENUMS.dispatchStatus}
                            isOpen={openEditorKey === `dashboard:${row.id}:dispatchStatus`}
                            onOpen={() => setOpenEditorKey(`dashboard:${row.id}:dispatchStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) =>
                              onUpdateItemStatus(row.id, "dispatchStatus", nextValue)
                            }
                          />
                        </td>
                        <td className="px-3 py-3">
                          <DueDateLabel item={row} today={today} />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="priority"
                            value={row.priority}
                            options={ENUMS.priority}
                            isOpen={openEditorKey === `dashboard:${row.id}:priority`}
                            onOpen={() => setOpenEditorKey(`dashboard:${row.id}:priority`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) => onUpdateItemStatus(row.id, "priority", nextValue)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-3 lg:hidden">
              {items.map((item) => {
                const overdue = isOverdue(item, today);
                return (
                  <div
                    key={item.id}
                    id={`snag-item-${item.id}`}
                    className="rounded-xl border bg-white p-4 text-left"
                    style={{
                      borderColor: overdue ? "var(--status-red-text)" : "var(--border)",
                      backgroundColor: overdue ? "rgba(253,231,231,0.35)" : "var(--bg-white)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {item.projectName}
                        </div>
                        <div className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {item.description}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                          {[
                            item.room || "Unspecified room",
                            getItemPanelTypeLabel(item),
                            formatItemSize(item),
                            `Qty ${item.quantity || "-"}`,
                          ].join(" · ")}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                          Reason: {getItemSnagReasonLabel(item)}
                        </div>
                        {item.materialSpec ? (
                          <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                            {item.materialSpec}
                          </div>
                        ) : null}
                      </div>
                      {overdue ? <AlertTriangle size={16} style={{ color: "var(--status-red-text)" }} /> : null}
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <EditableBadge
                        field="materialStatus"
                        value={item.materialStatus}
                        options={ENUMS.materialStatus}
                        isOpen={openEditorKey === `dashboard-mobile:${item.id}:materialStatus`}
                        onOpen={() => setOpenEditorKey(`dashboard-mobile:${item.id}:materialStatus`)}
                        onClose={() => setOpenEditorKey(null)}
                        onChange={(nextValue) => onUpdateItemStatus(item.id, "materialStatus", nextValue)}
                        className="w-full justify-between"
                      />
                      <EditableBadge
                        field="productionStatus"
                        value={item.productionStatus}
                        options={ENUMS.productionStatus}
                        isOpen={openEditorKey === `dashboard-mobile:${item.id}:productionStatus`}
                        onOpen={() => setOpenEditorKey(`dashboard-mobile:${item.id}:productionStatus`)}
                        onClose={() => setOpenEditorKey(null)}
                        onChange={(nextValue) => onUpdateItemStatus(item.id, "productionStatus", nextValue)}
                        className="w-full justify-between"
                      />
                      <EditableBadge
                        field="qcStatus"
                        value={item.qcStatus}
                        options={ENUMS.qcStatus}
                        isOpen={openEditorKey === `dashboard-mobile:${item.id}:qcStatus`}
                        onOpen={() => setOpenEditorKey(`dashboard-mobile:${item.id}:qcStatus`)}
                        onClose={() => setOpenEditorKey(null)}
                        onChange={(nextValue) => onUpdateItemStatus(item.id, "qcStatus", nextValue)}
                        className="w-full justify-between"
                      />
                      <EditableBadge
                        field="dispatchStatus"
                        value={item.dispatchStatus}
                        options={ENUMS.dispatchStatus}
                        isOpen={openEditorKey === `dashboard-mobile:${item.id}:dispatchStatus`}
                        onOpen={() => setOpenEditorKey(`dashboard-mobile:${item.id}:dispatchStatus`)}
                        onClose={() => setOpenEditorKey(null)}
                        onChange={(nextValue) => onUpdateItemStatus(item.id, "dispatchStatus", nextValue)}
                        className="w-full justify-between"
                      />
                      <EditableBadge
                        field="priority"
                        value={item.priority}
                        options={ENUMS.priority}
                        isOpen={openEditorKey === `dashboard-mobile:${item.id}:priority`}
                        onOpen={() => setOpenEditorKey(`dashboard-mobile:${item.id}:priority`)}
                        onClose={() => setOpenEditorKey(null)}
                        onChange={(nextValue) => onUpdateItemStatus(item.id, "priority", nextValue)}
                        className="w-full justify-between"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <DueDateLabel item={item} today={today} />
                      <button
                        type="button"
                        onClick={() => onOpenProject(item.projectId, item.id)}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-white"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        Open Project
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </SectionShell>
    </div>
  );
}

function ProjectCard({
  project,
  metrics,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border bg-white p-4 text-left transition hover:border-stone-400"
      style={{ borderColor: "var(--border)", boxShadow: "0 1px 2px rgba(26,26,24,0.04)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {project.name}
          </div>
          <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {[project.clientName, project.siteAddress].filter(Boolean).join(" · ") || "No client or site details"}
          </div>
        </div>
        <StatusBadge field="projectStatus" value={project.status} interactive={false} />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
        <div className="inline-flex items-center gap-1">
          <User size={14} />
          {project.assignedTo || "Unassigned"}
        </div>
        <div className="inline-flex items-center gap-1">
          <Calendar size={14} />
          {project.targetDate ? `Due ${formatDate(project.targetDate)}` : "No target date"}
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
          <span>
            {metrics.deliveredCount}/{metrics.totalItems} items delivered
          </span>
          <span>{metrics.overdueCount} overdue</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPercent(metrics.deliveredCount, metrics.totalItems)}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </div>
      </div>
    </button>
  );
}

function ProjectListScreen({
  projects,
  hasProjects,
  metricsByProject,
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  onNewProject,
  onSelectProject,
  onLoadSampleData,
  onClearSearchAndFilters,
}) {
  if (!hasProjects) {
    return (
      <EmptyState
        title="No projects yet"
        message="Create your first project to start tracking site visits, snag lists, and item movement through the factory."
        primaryAction={
          <button
            type="button"
            onClick={onNewProject}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Create first project
          </button>
        }
        secondaryAction={
          <button
            type="button"
            onClick={onLoadSampleData}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            Load sample data
          </button>
        }
      />
    );
  }

  if (!projects.length) {
    return (
      <EmptyState
        title="No projects match your filters"
        message="Try clearing the current search or status filter to see the full project list."
        primaryAction={
          <button
            type="button"
            onClick={onClearSearchAndFilters}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Clear search and filters
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <SectionShell
        title="Projects"
        actions={
          <button
            type="button"
            onClick={onNewProject}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plus size={16} />
            New Project
          </button>
        }
      >
        <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_180px_180px]">
          <button
            type="button"
            onClick={onNewProject}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm lg:hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <Plus size={16} />
            New Project
          </button>
          <SearchField value={searchInput} onChange={setSearchInput} placeholder="Search projects, client, address" />
          <SelectField
            value={statusFilter}
            onChange={setStatusFilter}
            options={ENUMS.projectStatus}
            className="w-full"
            allLabel="All statuses"
            includeAll
          />
          <SelectField
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "name", label: "Sort: Name" },
              { value: "createdAt", label: "Sort: Date Created" },
              { value: "targetDate", label: "Sort: Target Date" },
              { value: "overdue", label: "Sort: Overdue Count" },
            ]}
            className="w-full"
          />
        </div>
        <div className="mt-5 space-y-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              metrics={metricsByProject[project.id]}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

function SnagItemCard({
  item,
  projectName,
  snagListLabel,
  today,
  openEditorKey,
  setOpenEditorKey,
  onUpdateItemStatus,
  onEdit,
  onDelete,
  highlighted,
}) {
  const overdue = isOverdue(item, today);
  return (
    <div
      id={`snag-item-${item.id}`}
      className="rounded-xl border p-4"
      style={{
        borderColor: highlighted
          ? "var(--accent)"
          : overdue
            ? "var(--status-red-text)"
            : "var(--border)",
        backgroundColor: highlighted
          ? "rgba(232,240,230,0.75)"
          : overdue
            ? "rgba(253,231,231,0.35)"
            : "var(--bg-white)",
        boxShadow: overdue ? "inset 3px 0 0 #C5221F" : "none",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {item.description}
          </div>
          <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            {[
              item.room || "Unspecified room",
              getItemPanelTypeLabel(item),
              formatItemSize(item),
              `Qty ${item.quantity || "-"}`,
            ].join(" · ")}
          </div>
          <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            Reason: {getItemSnagReasonLabel(item)}
          </div>
          {item.materialSpec ? (
            <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              Material: {item.materialSpec}
            </div>
          ) : null}
          {projectName ? (
            <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              {projectName}
              {snagListLabel ? ` · ${snagListLabel}` : ""}
            </div>
          ) : snagListLabel ? (
            <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              {snagListLabel}
            </div>
          ) : null}
        </div>
        {overdue ? <AlertTriangle size={16} style={{ color: "var(--status-red-text)" }} /> : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["materialStatus", ENUMS.materialStatus],
          ["productionStatus", ENUMS.productionStatus],
          ["qcStatus", ENUMS.qcStatus],
          ["dispatchStatus", ENUMS.dispatchStatus],
        ].map(([field, options]) => (
          <div key={field}>
            <div className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
              {field.replace("Status", "")}
            </div>
            <EditableBadge
              field={field}
              value={item[field]}
              options={options}
              isOpen={openEditorKey === `detail:${item.id}:${field}`}
              onOpen={() => setOpenEditorKey(`detail:${item.id}:${field}`)}
              onClose={() => setOpenEditorKey(null)}
              onChange={(nextValue) => onUpdateItemStatus(item.id, field, nextValue)}
              className="w-full justify-between"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DueDateLabel item={item} today={today} />
          <EditableBadge
            field="priority"
            value={item.priority}
            options={ENUMS.priority}
            isOpen={openEditorKey === `detail:${item.id}:priority`}
            onOpen={() => setOpenEditorKey(`detail:${item.id}:priority`)}
            onClose={() => setOpenEditorKey(null)}
            onChange={(nextValue) => onUpdateItemStatus(item.id, "priority", nextValue)}
          />
          {item.source === "factory" && item.factoryOperator ? (
            <div className="rounded px-2 py-1 text-xs" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>
              {item.factoryOperator}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-medium"
            style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-medium"
            style={{ backgroundColor: "var(--status-red-bg)", color: "var(--status-red-text)" }}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {item.remarks ? (
        <div className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          Remarks: {item.remarks}
        </div>
      ) : null}
      <div className="mt-3 flex justify-end text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        Updated {timeAgo(item.updatedAt)}
      </div>
    </div>
  );
}

function ProjectDetailScreen({
  project,
  projectMetrics,
  snagLists,
  ungroupedItems,
  flatItems,
  filters,
  setFilters,
  searchInput,
  setSearchInput,
  viewMode,
  setViewMode,
  expandedLists,
  setExpandedLists,
  openEditorKey,
  setOpenEditorKey,
  onBack,
  onEditProject,
  onAddSnagList,
  onEditSnagList,
  onDeleteSnagList,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onUpdateItemStatus,
  onUpdateProjectStatus,
  onDeleteProject,
  highlightItemId,
  today,
  roomOptions,
  onClearSearchAndFilters,
}) {
  const chips = [
    filters.dispatchStatus !== "all" && {
      key: "dispatch",
      label: `Status: ${getEnumLabel("dispatchStatus", filters.dispatchStatus)}`,
      onRemove: () => setFilters((current) => ({ ...current, dispatchStatus: "all" })),
    },
    filters.room !== "all" && {
      key: "room",
      label: `Room: ${filters.room}`,
      onRemove: () => setFilters((current) => ({ ...current, room: "all" })),
    },
  ];

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        message="The selected project no longer exists."
        primaryAction={
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Back to Projects
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      <SectionShell
        title={project.name}
        actions={
          <>
            <button
              type="button"
              onClick={onEditProject}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <Edit size={16} />
              Edit Project
            </button>
            <button
              type="button"
              onClick={onDeleteProject}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: "var(--status-red-bg)", color: "var(--status-red-text)" }}
            >
              <Trash2 size={16} />
              Delete Project
            </button>
            <button
              type="button"
              onClick={() => onAddItem(null)}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <Plus size={16} />
              Add Item
            </button>
            <button
              type="button"
              onClick={onAddSnagList}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <Plus size={16} />
              Add Snag List
            </button>
          </>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px]">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              <div className="inline-flex items-center gap-1">
                <User size={14} />
                {project.clientName || "No client"}
              </div>
              <div className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {project.siteAddress || "No site address"}
              </div>
              <div className="inline-flex items-center gap-1">
                <Calendar size={14} />
                {project.targetDate ? formatDate(project.targetDate) : "No target date"}
              </div>
            </div>
            <div className="text-sm" style={{ color: "var(--text-primary)" }}>
              Assigned to {project.assignedTo || "unassigned"}
            </div>
            {project.notes ? (
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {project.notes}
              </div>
            ) : null}
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                Project Status
              </div>
              <EditableBadge
                field="projectStatus"
                value={project.status}
                options={ENUMS.projectStatus}
                isOpen={openEditorKey === `project:${project.id}:status`}
                onOpen={() => setOpenEditorKey(`project:${project.id}:status`)}
                onClose={() => setOpenEditorKey(null)}
                onChange={onUpdateProjectStatus}
                className="w-full justify-between"
              />
            </div>
            <div className="rounded-lg border p-3 text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}>
              <div className="flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Delivered</span>
                <span>
                  {projectMetrics.deliveredCount}/{projectMetrics.totalItems}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPercent(projectMetrics.deliveredCount, projectMetrics.totalItems)}%`,
                    backgroundColor: "var(--accent)",
                  }}
                />
              </div>
              <div className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                {projectMetrics.overdueCount} overdue · {projectMetrics.openCount} open
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="Snag Tracking"
        actions={
          <div className="inline-flex rounded-lg border p-1" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setViewMode("grouped")}
              className="rounded-md px-3 py-1.5 text-sm"
              style={{
                backgroundColor: viewMode === "grouped" ? "var(--accent-light)" : "transparent",
                color: viewMode === "grouped" ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              Grouped by Visit
            </button>
            <button
              type="button"
              onClick={() => setViewMode("flat")}
              className="rounded-md px-3 py-1.5 text-sm"
              style={{
                backgroundColor: viewMode === "flat" ? "var(--accent-light)" : "transparent",
                color: viewMode === "flat" ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              Flat List
            </button>
          </div>
        }
      >
        <div className="grid gap-3 lg:grid-cols-[220px_220px_minmax(0,1fr)]">
          <SelectField
            value={filters.dispatchStatus}
            onChange={(value) => setFilters((current) => ({ ...current, dispatchStatus: value }))}
            options={ENUMS.dispatchStatus}
            className="w-full"
            allLabel="All statuses"
            includeAll
          />
          <SelectField
            value={filters.room}
            onChange={(value) => setFilters((current) => ({ ...current, room: value }))}
            options={roomOptions}
            className="w-full"
            allLabel="All rooms"
            includeAll
          />
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search description, room, or remarks"
          />
        </div>
        <FilterChips
          chips={chips}
          onClearAll={onClearSearchAndFilters}
        />
        {viewMode === "flat" ? (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => onAddItem(null)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        ) : null}

        {viewMode === "grouped" ? (
          <div className="mt-5 space-y-4">
            {!snagLists.length && !ungroupedItems.length ? (
              <EmptyState
                title="No site visits recorded yet"
                message="Add a snag list to start capturing site visit findings for this project."
                primaryAction={
                  <button
                    type="button"
                    onClick={onAddSnagList}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Add Snag List
                  </button>
                }
              />
            ) : null}

            {snagLists.map((list) => {
              const isExpanded = expandedLists[list.id] !== false;
              return (
                <div
                  key={list.id}
                  className="rounded-xl border bg-white"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLists((current) => ({
                          ...current,
                          [list.id]: !isExpanded,
                        }))
                      }
                      className="flex items-center gap-2 text-left"
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          Visit {formatDate(list.visitDate)} · {list.reportedBy || "Unknown"}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {list.siteNotes || "No site notes"}
                        </div>
                      </div>
                    </button>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onAddItem(list.id)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        <Plus size={16} />
                        Add Item
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditSnagList(list)}
                        className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs"
                        style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSnagList(list)}
                        className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs"
                        style={{ backgroundColor: "var(--status-red-bg)", color: "var(--status-red-text)" }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                  {isExpanded ? (
                    <div className="space-y-3 p-4">
                      {list.items.length ? (
                        list.items.map((item) => (
                          <SnagItemCard
                            key={item.id}
                            item={item}
                            today={today}
                            snagListLabel={null}
                            projectName={null}
                            openEditorKey={openEditorKey}
                            setOpenEditorKey={setOpenEditorKey}
                            onUpdateItemStatus={onUpdateItemStatus}
                            onEdit={() => onEditItem(item)}
                            onDelete={() => onDeleteItem(item)}
                            highlighted={highlightItemId === item.id}
                          />
                        ))
                      ) : (
                        <div className="rounded-lg border border-dashed p-6 text-sm" style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}>
                          No items match the current filters for this visit.
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {ungroupedItems.length ? (
              <div className="rounded-xl border bg-white" style={{ borderColor: "var(--border)" }}>
                <div
                  className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      Ungrouped Items
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Added without a linked visit batch
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddItem(null)}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3 p-4">
                  {ungroupedItems.map((item) => (
                    <SnagItemCard
                      key={item.id}
                      item={item}
                      today={today}
                      snagListLabel="Ungrouped"
                      projectName={null}
                      openEditorKey={openEditorKey}
                      setOpenEditorKey={setOpenEditorKey}
                      onUpdateItemStatus={onUpdateItemStatus}
                      onEdit={() => onEditItem(item)}
                      onDelete={() => onDeleteItem(item)}
                      highlighted={highlightItemId === item.id}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : flatItems.length ? (
          <>
            <div className="mt-5 hidden overflow-x-auto lg:block">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                    {[
                      "Description",
                      "Room",
                      "Panel Type",
                      "Size (H x W x T)",
                      "Qty",
                      "Reason",
                      "Material",
                      "Production",
                      "QC",
                      "Dispatch",
                      "Due Date",
                      "Priority",
                      "Actions",
                    ].map((label) => (
                      <th
                        key={label}
                        className="px-3 py-3 text-xs font-medium uppercase tracking-wide"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flatItems.map((item, index) => {
                    const overdue = isOverdue(item, today);
                    return (
                      <tr
                        key={item.id}
                        id={`snag-item-${item.id}`}
                        className="border-b"
                        style={{
                          borderColor: "var(--border)",
                          backgroundColor:
                            highlightItemId === item.id
                              ? "rgba(232,240,230,0.75)"
                              : overdue
                                ? "rgba(253,231,231,0.35)"
                                : index % 2 === 0
                                  ? "var(--bg-white)"
                                  : "var(--bg-primary)",
                          boxShadow: overdue ? "inset 3px 0 0 #C5221F" : "none",
                        }}
                      >
                        <td className="px-3 py-3">
                          <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                            {item.description}
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {item.snagListId ? `Visit ${formatDate(item.visitDate)}` : "Ungrouped"}
                          </div>
                        </td>
                        <td className="px-3 py-3">{item.room || "Unspecified"}</td>
                        <td className="px-3 py-3">{getItemPanelTypeLabel(item)}</td>
                        <td className="px-3 py-3">{formatItemSize(item)}</td>
                        <td className="px-3 py-3">{item.quantity || "-"}</td>
                        <td className="px-3 py-3">{getItemSnagReasonLabel(item)}</td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="materialStatus"
                            value={item.materialStatus}
                            options={ENUMS.materialStatus}
                            isOpen={openEditorKey === `flat:${item.id}:materialStatus`}
                            onOpen={() => setOpenEditorKey(`flat:${item.id}:materialStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) =>
                              onUpdateItemStatus(item.id, "materialStatus", nextValue)
                            }
                          />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="productionStatus"
                            value={item.productionStatus}
                            options={ENUMS.productionStatus}
                            isOpen={openEditorKey === `flat:${item.id}:productionStatus`}
                            onOpen={() => setOpenEditorKey(`flat:${item.id}:productionStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) =>
                              onUpdateItemStatus(item.id, "productionStatus", nextValue)
                            }
                          />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="qcStatus"
                            value={item.qcStatus}
                            options={ENUMS.qcStatus}
                            isOpen={openEditorKey === `flat:${item.id}:qcStatus`}
                            onOpen={() => setOpenEditorKey(`flat:${item.id}:qcStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) => onUpdateItemStatus(item.id, "qcStatus", nextValue)}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="dispatchStatus"
                            value={item.dispatchStatus}
                            options={ENUMS.dispatchStatus}
                            isOpen={openEditorKey === `flat:${item.id}:dispatchStatus`}
                            onOpen={() => setOpenEditorKey(`flat:${item.id}:dispatchStatus`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) =>
                              onUpdateItemStatus(item.id, "dispatchStatus", nextValue)
                            }
                          />
                        </td>
                        <td className="px-3 py-3">
                          <DueDateLabel item={item} today={today} />
                        </td>
                        <td className="px-3 py-3">
                          <EditableBadge
                            field="priority"
                            value={item.priority}
                            options={ENUMS.priority}
                            isOpen={openEditorKey === `flat:${item.id}:priority`}
                            onOpen={() => setOpenEditorKey(`flat:${item.id}:priority`)}
                            onClose={() => setOpenEditorKey(null)}
                            onChange={(nextValue) => onUpdateItemStatus(item.id, "priority", nextValue)}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onEditItem(item)}
                              className="rounded px-2 py-1 text-xs"
                              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteItem(item)}
                              className="rounded px-2 py-1 text-xs"
                              style={{ backgroundColor: "var(--status-red-bg)", color: "var(--status-red-text)" }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-3 lg:hidden">
              {flatItems.map((item) => (
                <SnagItemCard
                  key={item.id}
                  item={item}
                  today={today}
                  projectName={null}
                  snagListLabel={item.snagListId ? `Visit ${formatDate(item.visitDate)}` : "Ungrouped"}
                  openEditorKey={openEditorKey}
                  setOpenEditorKey={setOpenEditorKey}
                  onUpdateItemStatus={onUpdateItemStatus}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item)}
                  highlighted={highlightItemId === item.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="No items match your filters"
              message="Try adjusting the room or status filters, or clear the search query."
              primaryAction={
                <button
                  type="button"
                  onClick={onClearSearchAndFilters}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Clear filters
                </button>
              }
            />
          </div>
        )}
      </SectionShell>
    </div>
  );
}

function FactoryViewScreen({
  groupedOperators,
  filters,
  setFilters,
  onOpenProject,
  today,
}) {
  const operatorOptions = groupedOperators.map((group) => ({
    value: group.operatorKey,
    label: group.operatorLabel,
  }));

  return (
    <div className="space-y-5">
      <SectionShell title="Factory View">
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField
            value={filters.operator}
            onChange={(value) => setFilters((current) => ({ ...current, operator: value }))}
            options={operatorOptions}
            className="w-full"
            allLabel="All operators"
            includeAll
          />
          <SelectField
            value={filters.productionStatus}
            onChange={(value) => setFilters((current) => ({ ...current, productionStatus: value }))}
            options={ENUMS.productionStatus}
            className="w-full"
            allLabel="All production states"
            includeAll
          />
        </div>

        {!groupedOperators.length ? (
          <div className="mt-5">
            <EmptyState
              title="No factory items found"
              message="Factory view only shows snag items where source is set to Factory."
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {groupedOperators.map((group) => (
              <div
                key={group.operatorKey}
                className="rounded-xl border bg-white p-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="mb-4 border-b pb-3" style={{ borderColor: "var(--border)" }}>
                  <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    {group.operatorLabel}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {group.total} items total
                  </div>
                </div>
                <div className="space-y-4">
                  {group.sections.map((section) => (
                    <div key={section.key}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                          {section.label}
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {section.items.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {section.items.length ? (
                          section.items.map((item) => {
                            const overdue = isOverdue(item, today);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => onOpenProject(item.projectId, item.id)}
                                className="w-full rounded-lg border p-3 text-left"
                                style={{
                                  borderColor: overdue ? "var(--status-red-text)" : "var(--border)",
                                  backgroundColor: overdue
                                    ? "rgba(253,231,231,0.35)"
                                    : "var(--bg-primary)",
                                }}
                              >
                                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                  {item.description}
                                </div>
                                <div className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                                  {item.projectName}
                                </div>
                                <div className="mt-1 flex items-center justify-between gap-3">
                                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                    {item.room || "Unspecified room"}
                                  </span>
                                  <span
                                    className="inline-flex items-center gap-1 text-xs"
                                    style={{
                                      color: overdue ? "var(--status-red-text)" : "var(--text-secondary)",
                                    }}
                                  >
                                    {item.dueDate ? formatDate(item.dueDate) : "No due"}
                                    {overdue ? <AlertTriangle size={12} /> : null}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="rounded-lg border border-dashed px-3 py-4 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                            No items in this bucket.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
}

function SettingsScreen({
  operators,
  teamMembers,
  notice,
  onExport,
  onImportClick,
  onLoadSample,
  onClearData,
  onManageOperator,
  onDeleteOperator,
  onManageTeamMember,
  onDeleteTeamMember,
}) {
  return (
    <div className="space-y-5">
      {notice ? (
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor:
              notice.tone === "error" ? "var(--status-red-text)" : "var(--border-strong)",
            backgroundColor:
              notice.tone === "error" ? "var(--status-red-bg)" : "var(--accent-light)",
            color:
              notice.tone === "error" ? "var(--status-red-text)" : "var(--accent)",
          }}
        >
          {notice.message}
        </div>
      ) : null}

      <SectionShell title="Data Management">
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <Download size={16} />
            Export All Data as JSON
          </button>
          <button
            type="button"
            onClick={onImportClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <Upload size={16} />
            Import Data from JSON
          </button>
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <Plus size={16} />
            Load Sample Data
          </button>
          <button
            type="button"
            onClick={onClearData}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium"
            style={{ backgroundColor: "var(--status-red-bg)", color: "var(--status-red-text)" }}
          >
            <Trash2 size={16} />
            Clear All Data
          </button>
        </div>
      </SectionShell>

      <SectionShell
        title="Factory Operators"
        actions={
          <button
            type="button"
            onClick={() => onManageOperator(null)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plus size={16} />
            Add Operator
          </button>
        }
      >
        <div className="space-y-2">
          {operators.map((operator) => (
            <div
              key={operator}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
            >
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {operator}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onManageOperator(operator)}
                  className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs"
                  style={{ backgroundColor: "var(--bg-white)", color: "var(--text-primary)" }}
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteOperator(operator)}
                  className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs"
                  style={{ backgroundColor: "var(--status-red-bg)", color: "var(--status-red-text)" }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title="Team Members"
        actions={
          <button
            type="button"
            onClick={() => onManageTeamMember(null)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plus size={16} />
            Add Team Member
          </button>
        }
      >
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div
              key={member}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
            >
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {member}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onManageTeamMember(member)}
                  className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs"
                  style={{ backgroundColor: "var(--bg-white)", color: "var(--text-primary)" }}
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTeamMember(member)}
                  className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs"
                  style={{ backgroundColor: "var(--status-red-bg)", color: "var(--status-red-text)" }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

export default function App() {
  const [data, dispatch] = useReducer(dataReducer, EMPTY_DATA);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectViewMode, setProjectViewMode] = useState("grouped");
  const [expandedLists, setExpandedLists] = useState({});
  const [openEditorKey, setOpenEditorKey] = useState(null);
  const [modal, setModal] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [settingsNotice, setSettingsNotice] = useState(null);
  const [highlightItemId, setHighlightItemId] = useState(null);

  const [dashboardSearchInput, setDashboardSearchInput] = useState("");
  const [dashboardFilters, setDashboardFilters] = useState({
    dispatchStatus: "all",
    priority: "all",
    operator: "all",
    overdue: false,
    materialGroup: "all",
  });

  const [projectListSearchInput, setProjectListSearchInput] = useState("");
  const [projectListStatusFilter, setProjectListStatusFilter] = useState("all");
  const [projectListSortBy, setProjectListSortBy] = useState("targetDate");

  const [projectDetailSearchInput, setProjectDetailSearchInput] = useState("");
  const [projectDetailFilters, setProjectDetailFilters] = useState({
    dispatchStatus: "all",
    room: "all",
  });

  const [factoryFilters, setFactoryFilters] = useState({
    operator: "all",
    productionStatus: "all",
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsHydrated(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
      }
    } catch (error) {
      console.error("Failed to load local data", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [data, isHydrated]);

  const today = todayKey();
  const dashboardSearch = useDebouncedValue(dashboardSearchInput, 250).trim().toLowerCase();
  const projectListSearch = useDebouncedValue(projectListSearchInput, 250)
    .trim()
    .toLowerCase();
  const projectDetailSearch = useDebouncedValue(projectDetailSearchInput, 250)
    .trim()
    .toLowerCase();

  const projectMap = useMemo(
    () => Object.fromEntries(data.projects.map((project) => [project.id, project])),
    [data.projects]
  );

  const snagListMap = useMemo(
    () => Object.fromEntries(data.snagLists.map((list) => [list.id, list])),
    [data.snagLists]
  );

  const projectMetrics = useMemo(() => {
    const metrics = {};
    data.projects.forEach((project) => {
      const items = data.snagItems.filter((item) => item.projectId === project.id);
      const deliveredCount = items.filter((item) => item.dispatchStatus === "delivered").length;
      const overdueCount = items.filter((item) => isOverdue(item, today)).length;
      metrics[project.id] = {
        totalItems: items.length,
        deliveredCount,
        overdueCount,
        openCount: items.filter((item) => item.dispatchStatus !== "delivered").length,
      };
    });
    return metrics;
  }, [data.projects, data.snagItems, today]);

  const dashboardOperatorOptions = useMemo(
    () =>
      data.operators.map((operator) => ({
        value: operator,
        label: operator,
      })),
    [data.operators]
  );

  const getSearchBlob = useCallback(
    (item) => {
      const project = projectMap[item.projectId];
      return [
        project?.name,
        item.description,
        item.room,
        getItemPanelTypeLabel(item),
        getItemSnagReasonLabel(item),
        item.materialSpec,
        item.remarks,
        item.factoryOperator,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    },
    [projectMap]
  );

  const dashboardItems = useMemo(() => {
    return data.snagItems
      .map((item) => ({
        ...item,
        projectName: projectMap[item.projectId]?.name || "Unknown project",
        projectAssignedTo: projectMap[item.projectId]?.assignedTo || "",
      }))
      .filter((item) => {
        if (dashboardFilters.dispatchStatus !== "all" && item.dispatchStatus !== dashboardFilters.dispatchStatus) {
          return false;
        }
        if (dashboardFilters.priority !== "all" && item.priority !== dashboardFilters.priority) {
          return false;
        }
        if (
          dashboardFilters.operator !== "all" &&
          item.factoryOperator !== dashboardFilters.operator
        ) {
          return false;
        }
        if (dashboardFilters.overdue && !isOverdue(item, today)) {
          return false;
        }
        if (
          dashboardFilters.materialGroup === "waiting" &&
          !["to_order", "ordered"].includes(item.materialStatus)
        ) {
          return false;
        }
        if (dashboardSearch && !getSearchBlob(item).includes(dashboardSearch)) {
          return false;
        }
        return true;
      })
      .sort((left, right) => {
        if (!left.dueDate && !right.dueDate) {
          return left.description.localeCompare(right.description);
        }
        if (!left.dueDate) {
          return 1;
        }
        if (!right.dueDate) {
          return -1;
        }
        return left.dueDate.localeCompare(right.dueDate);
      });
  }, [data.snagItems, projectMap, dashboardFilters, dashboardSearch, today, getSearchBlob]);

  const filteredProjects = useMemo(() => {
    return data.projects
      .filter((project) => {
        if (projectListStatusFilter !== "all" && project.status !== projectListStatusFilter) {
          return false;
        }
        if (!projectListSearch) {
          return true;
        }
        const searchBlob = [
          project.name,
          project.clientName,
          project.siteAddress,
          project.assignedTo,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchBlob.includes(projectListSearch);
      })
      .sort((left, right) => {
        if (projectListSortBy === "name") {
          return left.name.localeCompare(right.name);
        }
        if (projectListSortBy === "createdAt") {
          return right.createdAt.localeCompare(left.createdAt);
        }
        if (projectListSortBy === "overdue") {
          return (
            (projectMetrics[right.id]?.overdueCount || 0) -
            (projectMetrics[left.id]?.overdueCount || 0)
          );
        }
        if (!left.targetDate && !right.targetDate) {
          return left.name.localeCompare(right.name);
        }
        if (!left.targetDate) {
          return 1;
        }
        if (!right.targetDate) {
          return -1;
        }
        return left.targetDate.localeCompare(right.targetDate);
      });
  }, [
    data.projects,
    projectListStatusFilter,
    projectListSearch,
    projectListSortBy,
    projectMetrics,
  ]);

  const selectedProject = useMemo(
    () => data.projects.find((project) => project.id === selectedProjectId) || null,
    [data.projects, selectedProjectId]
  );

  const selectedProjectSnagLists = useMemo(() => {
    return data.snagLists
      .filter((list) => list.projectId === selectedProjectId)
      .sort((left, right) => right.visitDate.localeCompare(left.visitDate))
      .map((list) => {
        const items = data.snagItems
          .filter((item) => item.snagListId === list.id)
          .filter((item) => {
            if (
              projectDetailFilters.dispatchStatus !== "all" &&
              item.dispatchStatus !== projectDetailFilters.dispatchStatus
            ) {
              return false;
            }
            if (projectDetailFilters.room !== "all" && item.room !== projectDetailFilters.room) {
              return false;
            }
            if (projectDetailSearch && !getSearchBlob(item).includes(projectDetailSearch)) {
              return false;
            }
            return true;
          })
          .sort((left, right) => {
            if (!left.dueDate && !right.dueDate) {
              return left.description.localeCompare(right.description);
            }
            if (!left.dueDate) {
              return 1;
            }
            if (!right.dueDate) {
              return -1;
            }
            return left.dueDate.localeCompare(right.dueDate);
          });
        return { ...list, items };
      });
  }, [
    data.snagLists,
    data.snagItems,
    selectedProjectId,
    projectDetailFilters,
    projectDetailSearch,
    getSearchBlob,
  ]);

  const selectedProjectUngroupedItems = useMemo(() => {
    return data.snagItems
      .filter((item) => item.projectId === selectedProjectId && !item.snagListId)
      .filter((item) => {
        if (
          projectDetailFilters.dispatchStatus !== "all" &&
          item.dispatchStatus !== projectDetailFilters.dispatchStatus
        ) {
          return false;
        }
        if (projectDetailFilters.room !== "all" && item.room !== projectDetailFilters.room) {
          return false;
        }
        if (projectDetailSearch && !getSearchBlob(item).includes(projectDetailSearch)) {
          return false;
        }
        return true;
      })
      .sort((left, right) => {
        if (!left.dueDate && !right.dueDate) {
          return left.description.localeCompare(right.description);
        }
        if (!left.dueDate) {
          return 1;
        }
        if (!right.dueDate) {
          return -1;
        }
        return left.dueDate.localeCompare(right.dueDate);
      });
  }, [
    data.snagItems,
    selectedProjectId,
    projectDetailFilters,
    projectDetailSearch,
    getSearchBlob,
  ]);

  const selectedProjectFlatItems = useMemo(() => {
    return data.snagItems
      .filter((item) => item.projectId === selectedProjectId)
      .filter((item) => {
        if (
          projectDetailFilters.dispatchStatus !== "all" &&
          item.dispatchStatus !== projectDetailFilters.dispatchStatus
        ) {
          return false;
        }
        if (projectDetailFilters.room !== "all" && item.room !== projectDetailFilters.room) {
          return false;
        }
        if (projectDetailSearch && !getSearchBlob(item).includes(projectDetailSearch)) {
          return false;
        }
        return true;
      })
      .map((item) => ({
        ...item,
        visitDate: item.snagListId ? snagListMap[item.snagListId]?.visitDate || "" : "",
      }))
      .sort((left, right) => {
        if (!left.dueDate && !right.dueDate) {
          return left.description.localeCompare(right.description);
        }
        if (!left.dueDate) {
          return 1;
        }
        if (!right.dueDate) {
          return -1;
        }
        return left.dueDate.localeCompare(right.dueDate);
      });
  }, [
    data.snagItems,
    selectedProjectId,
    projectDetailFilters,
    projectDetailSearch,
    getSearchBlob,
    snagListMap,
  ]);

  const roomOptions = useMemo(() => {
    const projectRooms = data.snagItems
      .filter((item) => item.projectId === selectedProjectId && item.room)
      .map((item) => item.room);
    return normalizeStringList(ENUMS.rooms.concat(projectRooms)).map((room) => ({
      value: room,
      label: room,
    }));
  }, [data.snagItems, selectedProjectId]);

  const factoryGroups = useMemo(() => {
    const grouped = {};
    data.snagItems
      .filter((item) => item.source === "factory")
      .filter((item) => {
        if (factoryFilters.operator !== "all") {
          const operatorKey = item.factoryOperator || "__unassigned__";
          if (operatorKey !== factoryFilters.operator) {
            return false;
          }
        }
        if (
          factoryFilters.productionStatus !== "all" &&
          item.productionStatus !== factoryFilters.productionStatus
        ) {
          return false;
        }
        return true;
      })
      .forEach((item) => {
        const operatorKey = item.factoryOperator || "__unassigned__";
        const operatorLabel = item.factoryOperator || "Unassigned";
        if (!grouped[operatorKey]) {
          grouped[operatorKey] = {
            operatorKey,
            operatorLabel,
            items: [],
          };
        }
        grouped[operatorKey].items.push({
          ...item,
          projectName: projectMap[item.projectId]?.name || "Unknown project",
        });
      });

    return Object.values(grouped)
      .map((group) => ({
        operatorKey: group.operatorKey,
        operatorLabel: group.operatorLabel,
        total: group.items.length,
        sections: ENUMS.productionStatus.map((status) => ({
          key: status.value,
          label: status.label,
          items: group.items
            .filter((item) => item.productionStatus === status.value)
            .sort((left, right) => {
              if (!left.dueDate && !right.dueDate) {
                return left.description.localeCompare(right.description);
              }
              if (!left.dueDate) {
                return 1;
              }
              if (!right.dueDate) {
                return -1;
              }
              return left.dueDate.localeCompare(right.dueDate);
            }),
        })),
      }))
      .sort((left, right) => {
        if (left.operatorKey === "__unassigned__") {
          return 1;
        }
        if (right.operatorKey === "__unassigned__") {
          return -1;
        }
        return left.operatorLabel.localeCompare(right.operatorLabel);
      });
  }, [data.snagItems, factoryFilters, projectMap]);

  const updateModalField = useCallback((field, value) => {
    setModal((current) =>
      current
        ? {
            ...current,
            error: "",
            form: {
              ...current.form,
              [field]: value,
            },
          }
        : current
    );
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState(null);
  }, []);

  const navigateToProject = useCallback(
    (projectId, itemId = null) => {
      setActiveTab("projects");
      setSelectedProjectId(projectId);
      setProjectViewMode("grouped");
      setProjectDetailSearchInput("");
      setProjectDetailFilters({ dispatchStatus: "all", room: "all" });
      setHighlightItemId(itemId);
      if (itemId) {
        const item = data.snagItems.find((entry) => entry.id === itemId);
        if (item?.snagListId) {
          setExpandedLists((current) => ({ ...current, [item.snagListId]: true }));
        }
      }
    },
    [data.snagItems]
  );

  useEffect(() => {
    if (activeTab !== "projects" || !selectedProjectId || !highlightItemId) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`snag-item-${highlightItemId}`);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [
    activeTab,
    selectedProjectId,
    highlightItemId,
    projectViewMode,
    expandedLists,
    selectedProjectFlatItems.length,
    selectedProjectSnagLists.length,
  ]);

  const handleUpdateItemStatus = useCallback(
    (itemId, field, value) => {
      const item = data.snagItems.find((entry) => entry.id === itemId);
      if (!item) {
        return;
      }
      dispatch({
        type: "UPDATE_SNAG_ITEM",
        payload: {
          ...item,
          [field]: value,
          updatedAt: nowIso(),
        },
      });
    },
    [data.snagItems]
  );

  const handleUpdateProjectStatus = useCallback(
    (nextStatus) => {
      if (!selectedProject) {
        return;
      }
      dispatch({
        type: "UPDATE_PROJECT",
        payload: {
          ...selectedProject,
          status: nextStatus,
          updatedAt: nowIso(),
        },
      });
    },
    [selectedProject]
  );

  const openProjectForm = useCallback(
    (project) => {
      setModal({
        type: "projectForm",
        mode: project ? "edit" : "create",
        form: makeProjectForm(project),
        error: "",
      });
    },
    []
  );

  const saveProjectForm = useCallback(() => {
    if (!modal?.form?.name?.trim()) {
      setModal((current) => (current ? { ...current, error: "Project name is required." } : current));
      return;
    }

    const timestamp = nowIso();
    if (modal.mode === "edit") {
      const existing = data.projects.find((project) => project.id === modal.form.id);
      if (!existing) {
        return;
      }
      const updatedProject = {
        ...existing,
        ...modal.form,
        name: modal.form.name.trim(),
        clientName: modal.form.clientName.trim(),
        siteAddress: modal.form.siteAddress.trim(),
        assignedTo: modal.form.assignedTo.trim(),
        notes: modal.form.notes.trim(),
        updatedAt: timestamp,
      };
      dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
    } else {
      const project = {
        id: generateId(),
        name: modal.form.name.trim(),
        clientName: modal.form.clientName.trim(),
        siteAddress: modal.form.siteAddress.trim(),
        assignedTo: modal.form.assignedTo.trim(),
        targetDate: modal.form.targetDate,
        status: modal.form.status || "active",
        notes: modal.form.notes.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      dispatch({ type: "ADD_PROJECT", payload: project });
      setActiveTab("projects");
      setSelectedProjectId(project.id);
    }
    closeModal();
  }, [modal, data.projects, closeModal]);

  const openSnagListForm = useCallback(
    (projectId, snagList = null) => {
      setModal({
        type: "snagListForm",
        mode: snagList ? "edit" : "create",
        form: makeSnagListForm(projectId, snagList),
        error: "",
      });
    },
    []
  );

  const saveSnagListForm = useCallback(() => {
    if (!modal?.form?.visitDate || !modal?.form?.reportedBy?.trim()) {
      setModal((current) =>
        current
          ? { ...current, error: "Visit date and reported by are required." }
          : current
      );
      return;
    }
    const timestamp = nowIso();
    if (modal.mode === "edit") {
      const existing = data.snagLists.find((list) => list.id === modal.form.id);
      if (!existing) {
        return;
      }
      const updated = {
        ...existing,
        visitDate: modal.form.visitDate,
        reportedBy: modal.form.reportedBy.trim(),
        siteNotes: modal.form.siteNotes.trim(),
      };
      dispatch({ type: "UPDATE_SNAG_LIST", payload: updated });
      setExpandedLists((current) => ({ ...current, [updated.id]: true }));
    } else {
      const snagList = {
        id: generateId(),
        projectId: modal.form.projectId,
        visitDate: modal.form.visitDate,
        reportedBy: modal.form.reportedBy.trim(),
        siteNotes: modal.form.siteNotes.trim(),
        createdAt: timestamp,
      };
      dispatch({ type: "ADD_SNAG_LIST", payload: snagList });
      setExpandedLists((current) => ({ ...current, [snagList.id]: true }));
      setModal(null);
      setModal({
        type: "snagItemForm",
        mode: "create",
        form: makeItemForm(modal.form.projectId, snagList.id, null),
        showDetails: false,
        error: "",
        snagListOptions: data.snagLists
          .filter((list) => list.projectId === modal.form.projectId)
          .concat([snagList])
          .sort((left, right) => right.visitDate.localeCompare(left.visitDate)),
      });
      return;
    }
    closeModal();
  }, [modal, data.snagLists, closeModal]);

  const getProjectSnagListOptions = useCallback(
    (projectId) =>
      data.snagLists
        .filter((list) => list.projectId === projectId)
        .sort((left, right) => right.visitDate.localeCompare(left.visitDate)),
    [data.snagLists]
  );

  const openItemForm = useCallback(
    (projectId, snagListId = null, item = null) => {
      setModal({
        type: "snagItemForm",
        mode: item ? "edit" : "create",
        form: makeItemForm(projectId, snagListId, item),
        showDetails: item ? true : false,
        error: "",
        snagListOptions: getProjectSnagListOptions(projectId),
      });
    },
    [getProjectSnagListOptions]
  );

  const saveItemForm = useCallback(() => {
    if (
      !modal?.form?.description?.trim() ||
      !modal?.form?.panelType ||
      (modal.form.panelType === "other" && !modal.form.panelTypeOther.trim()) ||
      !modal.form.height.trim() ||
      !modal.form.width.trim() ||
      !modal.form.thickness.trim() ||
      !modal.form.quantity.trim() ||
      !modal.form.snagReason ||
      (modal.form.snagReason === "other" && !modal.form.snagReasonOther.trim())
    ) {
      setModal((current) =>
        current
          ? {
              ...current,
              error:
                "Description, panel type, size (H x W x T), qty, and snag reason are required.",
            }
          : current
      );
      return;
    }
    const timestamp = nowIso();
    const payload = {
      ...(modal.mode === "edit"
        ? data.snagItems.find((item) => item.id === modal.form.id)
        : {}),
      id: modal.mode === "edit" ? modal.form.id : generateId(),
      projectId: modal.form.projectId,
      snagListId: modal.form.snagListId || null,
      description: modal.form.description.trim(),
      room: modal.form.room.trim(),
      panelType: modal.form.panelType,
      panelTypeOther: modal.form.panelType === "other" ? modal.form.panelTypeOther.trim() : "",
      height: modal.form.height.trim(),
      width: modal.form.width.trim(),
      thickness: modal.form.thickness.trim(),
      quantity: modal.form.quantity.trim(),
      snagReason: modal.form.snagReason,
      snagReasonOther:
        modal.form.snagReason === "other" ? modal.form.snagReasonOther.trim() : "",
      materialSpec: modal.form.materialSpec.trim(),
      category: modal.form.category,
      source: modal.form.source,
      factoryOperator:
        modal.form.source === "factory" ? modal.form.factoryOperator.trim() : "",
      materialStatus: modal.form.materialStatus,
      productionStatus: modal.form.productionStatus,
      qcStatus: modal.form.qcStatus,
      dispatchStatus: modal.form.dispatchStatus,
      priority: modal.form.priority,
      dueDate: modal.form.dueDate,
      remarks: modal.form.remarks.trim(),
      createdAt:
        modal.mode === "edit"
          ? data.snagItems.find((item) => item.id === modal.form.id)?.createdAt || timestamp
          : timestamp,
      updatedAt: timestamp,
    };

    dispatch({
      type: modal.mode === "edit" ? "UPDATE_SNAG_ITEM" : "ADD_SNAG_ITEM",
      payload,
    });
    if (payload.snagListId) {
      setExpandedLists((current) => ({ ...current, [payload.snagListId]: true }));
    }
    closeModal();
  }, [modal, data.snagItems, closeModal]);

  const openEntityModal = useCallback((entityType, currentName = null) => {
    setModal({
      type: "entityForm",
      mode: currentName ? "edit" : "create",
      entityType,
      entityLabel: entityType === "operator" ? "Operator" : "Team Member",
      form: { name: currentName || "" },
      originalName: currentName || "",
      error: "",
    });
  }, []);

  const saveEntityModal = useCallback(() => {
    const name = modal?.form?.name?.trim();
    if (!name) {
      setModal((current) => (current ? { ...current, error: "Name is required." } : current));
      return;
    }
    if (modal.entityType === "operator") {
      dispatch({
        type: modal.mode === "edit" ? "UPDATE_OPERATOR" : "ADD_OPERATOR",
        payload:
          modal.mode === "edit"
            ? { previousName: modal.originalName, nextName: name }
            : name,
      });
    } else {
      dispatch({
        type: modal.mode === "edit" ? "UPDATE_TEAM_MEMBER" : "ADD_TEAM_MEMBER",
        payload:
          modal.mode === "edit"
            ? { previousName: modal.originalName, nextName: name }
            : name,
      });
    }
    closeModal();
  }, [modal, closeModal]);

  const handleDeleteProject = useCallback(
    (project) => {
      setConfirmState({
        title: "Delete project?",
        message:
          "This will permanently remove the project, its snag lists, and all linked snag items.",
        confirmLabel: "Delete Project",
        tone: "danger",
        onConfirm: () => {
          dispatch({ type: "DELETE_PROJECT", payload: project.id });
          if (selectedProjectId === project.id) {
            setSelectedProjectId(null);
          }
        },
      });
    },
    [selectedProjectId]
  );

  const handleDeleteSnagList = useCallback((snagList) => {
    setConfirmState({
      title: "Delete snag list?",
      message: "All items linked to this snag list will also be removed.",
      confirmLabel: "Delete Snag List",
      tone: "danger",
      onConfirm: () => dispatch({ type: "DELETE_SNAG_LIST", payload: snagList.id }),
    });
  }, []);

  const handleDeleteItem = useCallback((item) => {
    setConfirmState({
      title: "Delete snag item?",
      message: "This action cannot be undone.",
      confirmLabel: "Delete Item",
      tone: "danger",
      onConfirm: () => dispatch({ type: "DELETE_SNAG_ITEM", payload: item.id }),
    });
  }, []);

  const exportData = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `furdo-tracker-${today}.json`;
      anchor.click();
      window.URL.revokeObjectURL(url);
      setSettingsNotice({
        tone: "success",
        message: "Data export started.",
      });
    } catch (error) {
      setSettingsNotice({
        tone: "error",
        message: "Export failed. Try again.",
      });
    }
  }, [data, today]);

  const promptLoadSampleData = useCallback(() => {
    setConfirmState({
      title: "Load sample data?",
      message: "This replaces the current dataset with demo projects, snag lists, and items.",
      confirmLabel: "Load Sample Data",
      onConfirm: () => {
        dispatch({ type: "LOAD_SAMPLE" });
        setActiveTab("dashboard");
        setSelectedProjectId(null);
        setSettingsNotice({
          tone: "success",
          message: "Sample data loaded.",
        });
      },
    });
  }, []);

  const promptClearData = useCallback(() => {
    setConfirmState({
      title: "Clear all data?",
      message: "This removes every project, snag list, item, and dropdown list entry.",
      confirmLabel: "Clear Everything",
      tone: "danger",
      requiresText: true,
      expectedText: "DELETE",
      inputValue: "",
      onConfirm: () => {
        dispatch({ type: "REPLACE_ALL", payload: EMPTY_DATA });
        setActiveTab("dashboard");
        setSelectedProjectId(null);
        setSettingsNotice({
          tone: "success",
          message: "All local data cleared.",
        });
      },
    });
  }, []);

  const promptImportData = useCallback((payload) => {
    setConfirmState({
      title: "Replace data from import?",
      message: "Importing will replace the current local dataset with the uploaded file.",
      confirmLabel: "Import Data",
      onConfirm: () => {
        dispatch({ type: "REPLACE_ALL", payload });
        setActiveTab("dashboard");
        setSelectedProjectId(null);
        setSettingsNotice({
          tone: "success",
          message: "Data imported successfully.",
        });
      },
    });
  }, []);

  const handleImportFile = useCallback(
    (event) => {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const payload = normalizeData(JSON.parse(`${reader.result || "{}"}`));
          promptImportData(payload);
        } catch (error) {
          setSettingsNotice({
            tone: "error",
            message: "Import failed. Use a valid Furdo tracker JSON file.",
          });
        } finally {
          input.value = "";
        }
      };
      reader.readAsText(file);
    },
    [promptImportData]
  );

  const summary = useMemo(() => {
    const overdueItems = data.snagItems.filter((item) => isOverdue(item, today)).length;
    const waitingOnMaterial = data.snagItems.filter((item) =>
      ["to_order", "ordered"].includes(item.materialStatus)
    ).length;
    const readyToDispatch = data.snagItems.filter((item) => item.dispatchStatus === "ready").length;
    const activeProjects = data.projects.filter((project) => project.status === "active").length;
    return {
      activeProjects,
      overdueItems,
      waitingOnMaterial,
      readyToDispatch,
      operatorOptions: dashboardOperatorOptions,
      hasData: data.projects.length > 0,
      onActiveProjectsClick: () => {
        setActiveTab("projects");
        setProjectListStatusFilter("active");
      },
      onOverdueClick: () =>
        setDashboardFilters((current) => ({
          ...current,
          overdue: true,
        })),
      onWaitingClick: () =>
        setDashboardFilters((current) => ({
          ...current,
          materialGroup: "waiting",
        })),
      onReadyClick: () =>
        setDashboardFilters((current) => ({
          ...current,
          dispatchStatus: "ready",
        })),
    };
  }, [data.projects, data.snagItems, today, dashboardOperatorOptions]);

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <DashboardScreen
          summary={summary}
          items={dashboardItems}
          filters={dashboardFilters}
          searchInput={dashboardSearchInput}
          setSearchInput={setDashboardSearchInput}
          setFilters={setDashboardFilters}
          onClearFilters={() =>
            setDashboardFilters({
              dispatchStatus: "all",
              priority: "all",
              operator: "all",
              overdue: false,
              materialGroup: "all",
            })
          }
          openEditorKey={openEditorKey}
          setOpenEditorKey={setOpenEditorKey}
          onUpdateItemStatus={handleUpdateItemStatus}
          onOpenProject={navigateToProject}
          onNewProject={() => openProjectForm(null)}
          onLoadSampleData={promptLoadSampleData}
          onClearAll={() => {
            setDashboardFilters({
              dispatchStatus: "all",
              priority: "all",
              operator: "all",
              overdue: false,
              materialGroup: "all",
            });
            setDashboardSearchInput("");
          }}
          today={today}
        />
      );
    }

    if (activeTab === "projects" && selectedProjectId) {
      return (
        <ProjectDetailScreen
          project={selectedProject}
          projectMetrics={projectMetrics[selectedProjectId] || { totalItems: 0, deliveredCount: 0, overdueCount: 0, openCount: 0 }}
          snagLists={selectedProjectSnagLists}
          ungroupedItems={selectedProjectUngroupedItems}
          flatItems={selectedProjectFlatItems}
          filters={projectDetailFilters}
          setFilters={setProjectDetailFilters}
          searchInput={projectDetailSearchInput}
          setSearchInput={setProjectDetailSearchInput}
          viewMode={projectViewMode}
          setViewMode={setProjectViewMode}
          expandedLists={expandedLists}
          setExpandedLists={setExpandedLists}
          openEditorKey={openEditorKey}
          setOpenEditorKey={setOpenEditorKey}
          onBack={() => {
            setSelectedProjectId(null);
            setHighlightItemId(null);
          }}
          onEditProject={() => openProjectForm(selectedProject)}
          onAddSnagList={() => openSnagListForm(selectedProjectId)}
          onEditSnagList={(snagList) => openSnagListForm(selectedProjectId, snagList)}
          onDeleteSnagList={handleDeleteSnagList}
          onAddItem={(snagListId) => openItemForm(selectedProjectId, snagListId)}
          onEditItem={(item) => openItemForm(selectedProjectId, item.snagListId, item)}
          onDeleteItem={handleDeleteItem}
          onUpdateItemStatus={handleUpdateItemStatus}
          onUpdateProjectStatus={handleUpdateProjectStatus}
          onDeleteProject={() => handleDeleteProject(selectedProject)}
          highlightItemId={highlightItemId}
          today={today}
          roomOptions={roomOptions}
          onClearSearchAndFilters={() => {
            setProjectDetailFilters({ dispatchStatus: "all", room: "all" });
            setProjectDetailSearchInput("");
          }}
        />
      );
    }

    if (activeTab === "projects") {
      return (
        <ProjectListScreen
          projects={filteredProjects}
          hasProjects={data.projects.length > 0}
          metricsByProject={projectMetrics}
          searchInput={projectListSearchInput}
          setSearchInput={setProjectListSearchInput}
          statusFilter={projectListStatusFilter}
          setStatusFilter={setProjectListStatusFilter}
          sortBy={projectListSortBy}
          setSortBy={setProjectListSortBy}
          onNewProject={() => openProjectForm(null)}
          onSelectProject={setSelectedProjectId}
          onLoadSampleData={promptLoadSampleData}
          onClearSearchAndFilters={() => {
            setProjectListSearchInput("");
            setProjectListStatusFilter("all");
          }}
        />
      );
    }

    if (activeTab === "factory") {
      return (
        <FactoryViewScreen
          groupedOperators={factoryGroups}
          filters={factoryFilters}
          setFilters={setFactoryFilters}
          onOpenProject={navigateToProject}
          today={today}
        />
      );
    }

    return (
      <SettingsScreen
        operators={data.operators}
        teamMembers={data.teamMembers}
        notice={settingsNotice}
        onExport={exportData}
        onImportClick={() => document.getElementById("furdo-import-input")?.click()}
        onLoadSample={promptLoadSampleData}
        onClearData={promptClearData}
        onManageOperator={(name) => openEntityModal("operator", name)}
        onDeleteOperator={(name) =>
          setConfirmState({
            title: "Remove operator?",
            message: "This removes the operator from dropdown suggestions. Existing items keep their current value.",
            confirmLabel: "Remove Operator",
            tone: "danger",
            onConfirm: () => dispatch({ type: "DELETE_OPERATOR", payload: name }),
          })
        }
        onManageTeamMember={(name) => openEntityModal("teamMember", name)}
        onDeleteTeamMember={(name) =>
          setConfirmState({
            title: "Remove team member?",
            message: "This removes the team member from dropdown suggestions. Existing project assignments stay unchanged.",
            confirmLabel: "Remove Team Member",
            tone: "danger",
            onConfirm: () => dispatch({ type: "DELETE_TEAM_MEMBER", payload: name }),
          })
        }
      />
    );
  };

  const confirmAndClose = () => {
    if (confirmState?.onConfirm) {
      confirmState.onConfirm();
    }
    closeConfirm();
  };

  return (
    <div
      className="min-h-screen"
      style={{
        ...THEME_STYLE,
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontSize: "14px",
      }}
    >
      <NavigationBar
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setOpenEditorKey(null);
          setSettingsNotice(null);
          if (tab !== "projects") {
            setSelectedProjectId(null);
          }
        }}
      />

      <main className="mx-auto max-w-7xl px-4 pb-8 pt-24">{renderContent()}</main>

      <input
        id="furdo-import-input"
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      <ProjectFormModal
        modal={modal}
        onClose={closeModal}
        onChange={updateModalField}
        onSave={saveProjectForm}
        teamMembers={data.teamMembers}
      />

      <SnagListFormModal
        modal={modal}
        onClose={closeModal}
        onChange={updateModalField}
        onSave={saveSnagListForm}
        teamMembers={data.teamMembers}
      />

      <SnagItemFormModal
        modal={modal}
        onClose={closeModal}
        onChange={updateModalField}
        onSave={saveItemForm}
        onToggleDetails={() =>
          setModal((current) =>
            current ? { ...current, showDetails: !current.showDetails } : current
          )
        }
        operators={data.operators}
      />

      <SimpleEntityModal
        modal={modal}
        onClose={closeModal}
        onChange={updateModalField}
        onSave={saveEntityModal}
      />

      <ConfirmModal
        state={confirmState}
        onCancel={closeConfirm}
        onConfirm={confirmAndClose}
        onInputChange={(value) =>
          setConfirmState((current) => (current ? { ...current, inputValue: value } : current))
        }
      />
    </div>
  );
}
