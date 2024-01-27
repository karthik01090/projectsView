import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  onChangeProjectViewOption = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjects)
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(url)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetryButtonClicked = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure=view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onRetryButtonClicked}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-container">
        {projectsList.map(eachProject => (
          <ProjectItem projectDetails={eachProject} key={eachProject.id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderPageView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return this.renderLoadingView()
    }
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <div className="home-page-bg-container">
        <div className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="home-page-container">
          <select
            className="select-container"
            value={activeOptionId}
            onChange={this.onChangeProjectViewOption}
          >
            {categoriesList.map(eachOption => (
              <option value={eachOption.id}>{eachOption.displayText}</option>
            ))}
          </select>

          <div className="projects-list-view">{this.renderPageView()}</div>
        </div>
      </div>
    )
  }
}

export default Home
