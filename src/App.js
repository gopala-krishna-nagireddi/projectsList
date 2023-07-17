import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusCodes = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN-PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    projectsList: [],
    activeCategory: categoriesList[0].id,
    apiStatus: apiStatusCodes.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusCodes.inProgress})

    const {activeCategory} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const {projects} = data

      const updatedData = projects.map(project => ({
        id: project.id,
        imageUrl: project.image_url,
        name: project.name,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusCodes.success,
      })
    } else {
      this.setState({apiStatus: apiStatusCodes.failure})
    }
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list">
        {projectsList.map(project => {
          const {id, name, imageUrl} = project

          return (
            <li className="project-item" key={id}>
              <div className="project-item-container">
                <img className="project-img" src={imageUrl} alt={name} />
                <p>{name}</p>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-note">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" width="50px" height="50px" color="#328af2" />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusCodes.success:
        return this.renderSuccessView()
      case apiStatusCodes.failure:
        return this.renderFailureView()
      case apiStatusCodes.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectsList)
  }

  onClickRetryBtn = () => {
    this.getProjectsList()
  }

  render() {
    return (
      <div className="page-container">
        <div className="header-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="body-container">
          <select className="category-list" onChange={this.onChangeCategory}>
            {categoriesList.map(category => (
              <option
                className="category-option"
                key={category.id}
                value={category.id}
              >
                {category.displayText}
              </option>
            ))}
          </select>
          {this.renderApiStatus()}
        </div>
      </div>
    )
  }
}

export default App
