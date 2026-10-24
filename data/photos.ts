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
};
