export interface VehicleColorOption {
  id: string;
  name: string;
  hex: string;
  filterCss: string;
}

export interface SpecificationHotspot {
  id: string;
  title: string;
  shortDesc: string;
  fullDetail: string;
  xPercent: number; // position on vehicle image (0 - 100)
  yPercent: number;
}

export interface VehicleSpecs {
  modelName: string;
  tagline: string;
  priceEstimate: string;
  acceleration0to60: string;
  topSpeed: string;
  maxPower: string;
  torque: string;
  curbWeight: string;
  drivetrain: string;
  batteryCapacity: string;
  aerodynamics: string;
  chassis: string;
}

export const ARISE_VEHICLE_DATA: VehicleSpecs = {
  modelName: "Anti Gravity Aetheria GT",
  tagline: "The Pinnacle of Electric Hypercar Engineering",
  priceEstimate: "$285,000",
  acceleration0to60: "2.3 s",
  topSpeed: "225 mph (362 km/h)",
  maxPower: "1,020 HP",
  torque: "1,150 Nm",
  curbWeight: "1,480 kg",
  drivetrain: "Torque-Vectoring Quad Motor AWD",
  batteryCapacity: "105 kWh (800V Architecture)",
  aerodynamics: "0.21 Cd Active Aero",
  chassis: "Monocoque Carbon Fiber Chassis"
};

export const VEHICLE_COLOR_OPTIONS: VehicleColorOption[] = [
  {
    id: "obsidian",
    name: "Obsidian Black",
    hex: "#0f172a",
    filterCss: "none"
  },
  {
    id: "pearl",
    name: "Pearl White",
    hex: "#f8fafc",
    filterCss: "brightness(1.35) contrast(1.1) saturate(0.8)"
  },
  {
    id: "red",
    name: "Racing Red",
    hex: "#ef4444",
    filterCss: "hue-rotate(-140deg) saturate(1.8) brightness(0.9)"
  },
  {
    id: "titanium",
    name: "Titanium Silver",
    hex: "#94a3b8",
    filterCss: "brightness(1.2) contrast(1.05) saturate(0.4)"
  },
  {
    id: "blue",
    name: "Deep Blue",
    hex: "#2563eb",
    filterCss: "hue-rotate(35deg) saturate(1.5) brightness(0.9)"
  }
];

export const VEHICLE_HOTSPOTS: SpecificationHotspot[] = [
  {
    id: "aero",
    title: "Active Aero & Splitter",
    shortDesc: "Cd 0.21 active downforce wing & front diffuser",
    fullDetail: "Adaptive carbon flaps adjust dynamically at speeds over 80 mph to generate up to 450 kg of downforce while optimizing heat extraction.",
    xPercent: 22,
    yPercent: 62
  },
  {
    id: "powertrain",
    title: "Quad-Motor Electric Drive",
    shortDesc: "1,020 HP torque vectoring all-wheel drive",
    fullDetail: "Instantaneous torque distribution across all four wheels with sub-millisecond precision for cornering accuracy and 2.3s 0-60 mph launch.",
    xPercent: 48,
    yPercent: 54
  },
  {
    id: "chassis",
    title: "Carbon Fiber Monocoque",
    shortDesc: "Ultra-lightweight structural rigid cell",
    fullDetail: "Aerospace-grade resin pre-preg carbon fiber cell providing exceptional torsional stiffness of 52,000 Nm/deg while keeping curb weight at 1,480 kg.",
    xPercent: 74,
    yPercent: 45
  }
];
