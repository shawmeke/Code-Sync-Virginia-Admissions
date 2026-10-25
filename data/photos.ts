// Campus photographs from Wikimedia Commons, each under the license named
// here. The app credits the photographer and license wherever a photo shows.

export type CampusPhoto = {
  // A require()d image asset.
  image: number;
  title: string;
  artist: string;
  license: string;
  licenseUrl: string;
  page: string;
};

export const campusPhotos: Record<string, CampusPhoto> = {
  uva: {
    image: require('../assets/images/campus/uva.jpg'),
    title: "The Rotunda and Lawn University of Virginia Charlottesville VA March 2011",
    artist: "Phil Roeder",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:The_Rotunda_and_Lawn_University_of_Virginia_Charlottesville_VA_March_2011.jpg",
  },
  vt: {
    image: require('../assets/images/campus/vt.jpg'),
    title: "Virginia Tech Burruss Hall from Drillfield",
    artist: "Eric T Gunther",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Virginia_Tech_Burruss_Hall_from_Drillfield.JPG",
  },
  wm: {
    image: require('../assets/images/campus/wm.jpg'),
    title: "The Wren Building (3501325643)",
    artist: "benuski from Richmond, VA, USA",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:The_Wren_Building_(3501325643).jpg",
  },
  jmu: {
    image: require('../assets/images/campus/jmu.jpg'),
    title: "Wilson Hall closeup",
    artist: "Rtcpenguin",
    license: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5",
    page: "https://commons.wikimedia.org/wiki/File:Wilson_Hall_closeup.JPG",
  },
  odu: {
    image: require('../assets/images/campus/odu.jpg'),
    title: "Kaufman Mall and the Webb University Center (cropped)",
    artist: "Cmett003",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Kaufman_Mall_and_the_Webb_University_Center_(cropped).JPG",
  },
  gmu: {
    image: require('../assets/images/campus/gmu.jpg'),
    title: "An aerial view of the Johnson Center at dawn.",
    artist: "Nicolas Tan/Creative Services/George Mason University",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:An_aerial_view_of_the_Johnson_Center_at_dawn..jpg",
  },
  vcu: {
    image: require('../assets/images/campus/vcu.jpg'),
    title: "Grace E. Harris Hall, VCU",
    artist: "Eli Christman",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Grace_E._Harris_Hall,_VCU.jpg",
  },
  radford: {
    image: require('../assets/images/campus/radford.jpg'),
    title: "Muse Hall, Radford University",
    artist: "Nyttend",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:Muse_Hall,_Radford_University.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Muse_Hall,_Radford_University.jpg",
  },
  richmond: {
    image: require('../assets/images/campus/richmond.jpg'),
    title: "BoatwrightTower",
    artist: "TrunkJunk",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:BoatwrightTower.jpg",
    page: "https://commons.wikimedia.org/wiki/File:BoatwrightTower.jpg",
  },
  wlu: {
    image: require('../assets/images/campus/wlu.jpg'),
    title: "Washington Hall, Washington and Lee University, Lexington, VA",
    artist: "Zeete",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Washington_Hall,_Washington_and_Lee_University,_Lexington,_VA.jpg",
  },
  vmi: {
    image: require('../assets/images/campus/vmi.jpg'),
    title: "VMI Barracks",
    artist: "Nick40ghs",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    page: "https://commons.wikimedia.org/wiki/File:VMI_Barracks.JPG",
  },
  regent: {
    image: require('../assets/images/campus/regent.jpg'),
    title: "Regent University Robertson Hall",
    artist: "DebateLord",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Regent_University_Robertson_Hall.jpg",
  },
  umw: {
    image: require('../assets/images/campus/umw.jpg'),
    title: "Monroe Hall UMW",
    artist: "Jte288",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:Monroe_Hall_UMW.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Monroe_Hall_UMW.jpg",
  },
  shenandoah: {
    image: require('../assets/images/campus/shenandoah.jpg'),
    title: "Shenandoah U; Ohrstrom-Bryant Theatre",
    artist: "Eruditefello",
    license: "CC BY-SA 3.0",
    licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:Shenandoah_U;_Ohrstrom-Bryant_Theatre.JPG",
  },
  vsu: {
    image: require('../assets/images/campus/vsu.jpg'),
    title: "Vawter Hall at VSU",
    artist: "Jweaver28",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Vawter_Hall_at_VSU.jpg",
  },
};
