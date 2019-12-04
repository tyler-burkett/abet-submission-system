const evaluation = require('../../../main/lib/evaluate_num_students')
const { expect } = require('../../chai')


describe('User Story 17 - Correct ammount of Artifacts to edit', () => {
        
        it('Number of Students less than 10', async () => {
        // Arrange
        var input = 5
        const expected_output = 1

        // Act
        var actual_output = evaluation.evaluate_num_students(input)

        // Assert
        expect(actual_output).to.equal(expected_output)

        })
        it('Number of Students equal to 10', async () => {
        // Arrange
        var input = 10
        const expected_output = 10

        // Act
        var actual_output = evaluation.evaluate_num_students(input)

        // Assert
        expect(actual_output).to.equal(expected_output)

        })
        it('Number of Students greater than 10', async () => {
        // Arrange
        var input = 15
        const expected_output = 10

        // Act
        var actual_output = evaluation.evaluate_num_students(input)

        // Assert
        expect(actual_output).to.equal(expected_output)

        })

})
