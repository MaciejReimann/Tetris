import { merge, addCoords, arePointsEqual } from '../../helpers/gameLogic.js';

it('Merges two objects', () => {
  expect(merge({ x: 0, y: 0 }) ({ z: "string" })
    ).toEqual({ x: 0, y: 0, z: "string" })

  expect(merge({ x: 1, y: 1 }) ({ x: 2, y: 2 })
  ).toEqual({ x: 2, y: 2 })

  expect(merge({ x: 1, y: 1 }) ({ })
    ).toEqual({ x: 1, y: 1 })
})

it('Adds values of two objects', () => {
  expect(addCoords({ x: -1, y: -1 }) ({ x: 1, y: 1 })
    ).toEqual({ x: 0, y: 0 })

  expect(addCoords({ x: 1, y: 1 }) ({ x: .5, y: .5 })
    ).toEqual({ x: 1.5, y: 1.5 })
})

it('Checks if two points are equal', () => {
  expect(arePointsEqual({ x: -1, y: -1 }) ({ x: 1, y: 1 })
    ).toBeFalsy();

  expect(arePointsEqual({ x: 1, y: 1 }) ({ x: 1, y: 1 })
    ).toBeTruthy()

})
