import { merge, addPoints, translateToCartesian } from "./pointsManipulation";

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

export const getSquareVertices = angle => center => dim =>
  regularPolygon(angle + 45)(center)(4)((dim / 2) * Math.sqrt(2));
