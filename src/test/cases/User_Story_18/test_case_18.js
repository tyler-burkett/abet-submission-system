const evaluation = require('../../../main/lib/evaluate_num_students')
const random_stu = require('../../../main/lib/random_students')
const { expect } = require('../../chai')

const sinon = require('sinon')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();


describe('User Story 18 - Group of Students is generated randomly', () => {
  // this is ran after each unit test
    afterEach(() => {
      // this is needed to restore the CoursePortfolio model back to it's original state
      // we don't want to break all future unit tests
      sandbox.restore();
    })
    it('Number of Students less than 10', async () => {
      // Arrange
      const input = 5
      const expected_output = [1]
      const stub_to_pick = sandbox.stub(evaluation, "evaluate_num_students")
      const stub_random = sandbox.stub(Math, "random")

      stub_to_pick.onCall(0).returns(1)
      stub_random.onCall(0).returns(0)
      stub_random.onCall(1).returns(.1)
      stub_random.onCall(2).returns(.2)
      stub_random.onCall(3).returns(.3)
      stub_random.onCall(4).returns(.4)

      // Act
      const actual_output = random_stu.random_students(input)

      // Assert
      expect(actual_output).to.deep.equal(expected_output)
  })
  it('Number of Students equal to 10', async () => {
      // Arrange
      const input = 10
      const expected_output = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const stub_to_pick = sandbox.stub(evaluation, "evaluate_num_students")
      const stub_random = sandbox.stub(Math, "random")

      stub_to_pick.onCall(0).returns(10)
      stub_random.onCall(0).returns(0)
      stub_random.onCall(1).returns(.1)
      stub_random.onCall(2).returns(.2)
      stub_random.onCall(3).returns(.3)
      stub_random.onCall(4).returns(.4)
      stub_random.onCall(5).returns(.5)
      stub_random.onCall(6).returns(.6)
      stub_random.onCall(7).returns(.7)
      stub_random.onCall(8).returns(.8)
      stub_random.onCall(9).returns(.9)

      // Act
      const actual_output = random_stu.random_students(input)

      // Assert
      expect(actual_output).to.deep.equal(expected_output)

    
  })
  it('Number of Students greater than 10', async () => {
      // Arrange
      const input = 15
      const expected_output = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      const stub_to_pick = sandbox.stub(evaluation, "evaluate_num_students")
      const stub_random = sandbox.stub(Math, "random")


      stub_to_pick.onCall(0).returns(10)
      stub_random.onCall(0).returns(0)
      stub_random.onCall(1).returns(.1)
      stub_random.onCall(2).returns(.2)
      stub_random.onCall(3).returns(.3)
      stub_random.onCall(4).returns(.4)
      stub_random.onCall(5).returns(.5)
      stub_random.onCall(6).returns(.6)
      stub_random.onCall(7).returns(.7)
      stub_random.onCall(8).returns(.8)
      stub_random.onCall(9).returns(.9)
      stub_random.onCall(10).returns(.9)
      stub_random.onCall(11).returns(.9)
      stub_random.onCall(12).returns(.9)
      stub_random.onCall(13).returns(.9)
      stub_random.onCall(14).returns(.9)

      // Act
      const actual_output = random_stu.random_students(input)

      // Assert
      expect(actual_output).to.deep.equal(expected_output)
  })
})
