// example : geo-fencing and recomended route using cluster algorithm

/**
 * Distance
 *
 * Calculate distance between two or multiple locations using Mathematic functions.
 * fork from github and port to javascript.
 * @author Dwinanto Saputra <dwinanto@grip-principle.com>
 * @author Jeroen Desloovere <info@jeroendesloovere.be>
 */
export default class Distance {
  constructor() {}
  /**
   * Get distance between two coordinates
   *
   * @return float
   * @param  decimal $latitude1
   * @param  decimal $longitude1
   * @param  decimal $latitude2
   * @param  decimal $longitude2
   * @param  int     $decimals[optional] The amount of decimals
   * @param  string  $unit[optional]
   */
  public static between(
    latitude1,
    longitude1,
    latitude2,
    longitude2,
    decimals,
    unit,
  ) {
    // define calculation variables
    let theta = longitude1 - longitude2;
    let distance =
      Math.sin((latitude1 * Math.PI) / 180.0) *
        Math.sin((latitude2 * Math.PI) / 180.0) +
      Math.cos((latitude1 * Math.PI) / 180.0) *
        Math.cos((latitude2 * Math.PI) / 180.0) *
        Math.cos((theta * Math.PI) / 180.0);
    distance = Math.acos(distance);
    distance = (distance * Math.PI) / 180.0;
    distance = distance * 60 * 1.1515;

    // unit is km
    if (unit !== 'miles') {
      // redefine distance
      distance = distance * 1.609344;
      if (unit !== 'km') {
        distance = distance * 1000;
        if (unit !== 'meter') {
          distance = distance * 100;
          if (unit !== 'centimeter') {
            distance = distance * 0.0328083;
            if (unit !== 'feet') {
              distance = distance * 0.000189394;
            }
          }
        }
      }
    }

    // return with one decimal
    return parseFloat(distance.toPrecision(decimals));
  }

  /**
   * Get closest location from all locations
   *
   * @return array   The item which is the closest + 'distance' to it.
   * @param  decimal latitude1
   * @param  decimal longitude1
   * @param  array   items = [Location] array or object with numeric index key 
   * @param  int     decimals[optional] The amount of decimals
   * @param  string  unit[optional]
   */
  public static getClosest(latitude1, longitude1, items, decimals, unit) {
    // init result
    const distances = new Map(
      Array.from({length: items.length}).map((num, index) => {
        let i = index;

        let latitude2 = items[i].latitude;
        let longitude2 = items[i].longitude;

        let distance = Distance.between(
          latitude1,
          longitude1,
          latitude2,
          longitude2,
          10,
          unit,
        );
        items[i].distance = parseFloat(distance.toPrecision(decimals));

        return [distance, i];
      }),
    );

    distances[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => a - b);
    };

    // return the item with the closest d
    let near = [...distances].shift();
    return distances.get(
      near?.shift() ??
        new Map([...distances.entries()].sort((a, b) => a - b)).keys().next()
          .value,
    );
  }
}
