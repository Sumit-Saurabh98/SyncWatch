import { useParams } from "react-router-dom"

const Profilepage = () => {
    const {_id} = useParams();
  return (
    <div>
      This is user profile
      {_id}
    </div>
  )
}

export default Profilepage
