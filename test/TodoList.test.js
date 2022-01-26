const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed()
  })
  
  //Testing if the deploy was successful by checking the contract address
  it('deploys successfully', async () => {
    const address = await this.todoList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)    
  })

  //Testing if the task list is ok by checking default properties are ok
  it('lists tasks', async () => {
    const taskCount = await this.todoList.taskCount()
    const task = await this.todoList.tasks(taskCount)
    //These values was set this way at TodoList.sol's constructor, etc.
    assert.equal(task.id.toNumber(), taskCount.toNumber())
    assert.equal(task.content, 'Check out dappuniversity.com')
    assert.equal(task.completed, false)
    assert.equal(taskCount.toNumber(), 1)
  })

  //Testing if tasks are being created properly
  it('creates tasks', async () => {
    const result = await this.todoList.createTask('A new task')
    const taskCount = await this.todoList.taskCount()
    assert.equal(taskCount, 2)
    //Capturing the Task object from the event triggered as createTask was invoked
    const task = result.logs[0].args
    assert.equal(task.id.toNumber(), 2)
    assert.equal(task.content, 'A new task')
    assert.equal(task.completed, false)
  })
})