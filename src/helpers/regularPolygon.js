import { merge, addPoints, translateToCartesian } from "./pointsHelpers";

// Returns cartesian local coordinates of regular polygin vertices
export const regularPolygon = angle => center => sides => r =>
  Array(sides)
    .fill()
    .map((_, i) =>
      addPoints(
        translateToCartesian(
          merge({})({
            r: r,
            angle: (360 / sides) * i + angle
          })
        )
      )(center)
    );
