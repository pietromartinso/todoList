App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //Additional check probably introduced by Gregory fom Dapp University
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Accounts now exposed
        web3.eth.sendTransaction({/* ... */}) //is this really necessary???
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Accounts always exposed
      web3.eth.sendTransaction({/* ... */}) //is this really needed?
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    //Retrieving the TodoList.json file (generated via "truffle compile")
    const todoList = await $.getJSON('TodoList.json')
    //Instantiating the Smart Contract into JavaScript
    App.contracts.TodoList = TruffleContract(todoList)
    //Instantiating the MetaMask into the provider of our App
    App.contracts.TodoList.setProvider(App.web3Provider)
    //Getting the ganache deployed TodoList.sol contract
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    //Prevent double render
    if(App.loading){
      return
    }

    //Update app loading state
    App.setLoading(true)

    //Render account into the "header" of the web page (span tag from the html)
    $('#account').html(App.account)

    //Render tasks at the proper lists (pending & completed)
    await App.renderTasks()

    //Update app loading state
    App.setLoading(false)

  },

  renderTasks: async () => {
    //Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    //Capturing the taskTemplate from HTML via jQuery
    const $taskTemplate = $('.taskTemplate')

    //Render out each task with a new task template
    for(var i = 1; i<= taskCount; i++){
      //Capturing attributes for task at the "i" index of our SC's mapping
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      console.log("Dados do SC: " + taskId + " - " + taskContent + ": " + taskCompleted)

      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
      
      //Put the task in the correct list
      if(taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }
      //Show the task
      $newTaskTemplate.show()
    }
  },

  createTask: async () => {
    try{
      App.setLoading(true)
      //Retrieving the text from the HTML form to create the desired task
      const content = $('#newTask').val()

      //I had to add "{from: App.account}" as parameter 
      //since web3 was launching "invalid address" error
      await App.todoList.createTask(content, {from: App.account})
      
      //Reload the page
      window.location.reload()
    } catch (err){
      console.log(err)
    }
  },

  //Passing the event e as argument ("onClick from the HTML")
  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name //name is set to the taskId (when taskCreated())

    //I had to add "{from: App.account}" as parameter 
    //since web3 was launching "invalid address" error
    await App.todoList.toggleCompleted(taskId, {from: App.account})

    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },
  
}

/* 
jQuery for loading window event 
(this will be invoked as soon as the window loads) 
*/
$(() => {
  $(window).load(() => {
    App.load()
  }) 
})