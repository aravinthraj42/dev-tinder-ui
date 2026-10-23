import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'

const GENDERS = ['Male', 'Female', 'Other']
const DEFAULT_AVATAR = '/default-avatar.png'

const isValidUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Mirrors the rules in the Mongoose schema so users get feedback before the request
const validate = (form) => {
  const errors = {}

  if (form.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters.'
  }
  if (form.lastName.trim() && form.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.'
  }
  if (form.age !== '' && Number(form.age) < 18) {
    errors.age = 'Age must be 18 or older.'
  }
  if (form.phoneNumber && !/^\d{10,15}$/.test(form.phoneNumber)) {
    errors.phoneNumber = 'Enter 10 to 15 digits, numbers only.'
  }
  if (form.profileUrl && !isValidUrl(form.profileUrl)) {
    errors.profileUrl = 'Enter a valid image URL starting with http:// or https://.'
  }

  return errors
}

const Field = ({ label, error, hint, children }) => (
  <label className="form-control w-full">
    <span className="label-text mb-1 block text-sm font-medium">{label}</span>
    {children}
    {error ? (
      <span className="mt-1 block text-sm text-error">{error}</span>
    ) : hint ? (
      <span className="mt-1 block text-sm text-base-content/60">{hint}</span>
    ) : null}
  </label>
)

const EditProfile = (user) => {
  const dispatch = useDispatch()


  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    age: user?.age ?? '',
    gender: user?.gender ?? '',
    phoneNumber: user?.phoneNumber ? String(user.phoneNumber) : '',
    about: user?.about ?? '',
    profileUrl: user?.profileUrl ?? '',
  })
  const [skills, setSkills] = useState(user?.skill ?? [])
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSaved(false)
  }

  const addSkill = () => {
    const next = skillInput.trim().replace(/,$/, '')
    if (!next) return
    const exists = skills.some((s) => s.toLowerCase() === next.toLowerCase())
    if (!exists) setSkills((prev) => [...prev, next])
    setSkillInput('')
    setSaved(false)
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    } else if (e.key === 'Backspace' && !skillInput && skills.length) {
      setSkills((prev) => prev.slice(0, -1))
    }
  }

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)
    setSaved(false)

    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    // Only send fields that have a value, so empty inputs don't overwrite defaults
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      about: form.about.trim(),
      skill: skills,
    }
    if (form.age !== '') payload.age = Number(form.age)
    if (form.gender) payload.gender = form.gender
    if (form.phoneNumber) payload.phoneNumber = Number(form.phoneNumber)
    if (form.profileUrl) payload.profileUrl = form.profileUrl.trim()

    setSaving(true)
    try {
      // Adjust the method and endpoint to match your backend
      const res = await axios.patch(`${API_BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      })
      dispatch(addUser(res.data?.user ?? res.data))
      setSaved(true)
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data ||
          'Could not save your profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const previewName = `${form.firstName} ${form.lastName}`.trim() || 'Your name'

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="card bg-base-100 shadow-sm"
      >
        <div className="card-body gap-5">
          <div>
            <h2 className="card-title text-2xl">Edit profile</h2>
            <p className="text-sm text-base-content/60">
              This is what other developers see on their feed.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName}>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                autoComplete="given-name"
                required
              />
            </Field>

            <Field label="Last name" error={errors.lastName}>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                autoComplete="family-name"
              />
            </Field>

            <Field label="Age" error={errors.age}>
              <input
                type="number"
                name="age"
                min="18"
                value={form.age}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.age ? 'input-error' : ''}`}
              />
            </Field>

            <Field label="Gender">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Phone number"
            error={errors.phoneNumber}
            hint="Digits only, no spaces or country symbol."
          >
            <input
              type="tel"
              inputMode="numeric"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={`input input-bordered w-full ${errors.phoneNumber ? 'input-error' : ''}`}
              autoComplete="tel-national"
            />
          </Field>

          <Field
            label="Profile photo URL"
            error={errors.profileUrl}
            hint="Link to a direct image file (.jpg, .png, .webp)."
          >
            <input
              type="url"
              name="profileUrl"
              value={form.profileUrl}
              onChange={handleChange}
              placeholder="https://"
              className={`input input-bordered w-full ${errors.profileUrl ? 'input-error' : ''}`}
            />
          </Field>

          <Field label="About">
            <textarea
              name="about"
              rows={4}
              value={form.about}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="What do you build, and what are you looking for?"
            />
          </Field>

          <Field label="Skills" hint="Press Enter or comma to add. Backspace removes the last one.">
            <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-base-content/20 px-3 py-2 focus-within:border-primary focus-within:outline focus-within:outline-2 focus-within:outline-primary/30">
              {skills.map((skill) => (
                <span key={skill} className="badge badge-primary badge-lg gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    className="cursor-pointer text-primary-content/80 hover:text-primary-content"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={addSkill}
                placeholder={skills.length ? '' : 'React, Node.js, MongoDB'}
                className="min-w-32 flex-1 bg-transparent outline-none"
              />
            </div>
          </Field>

          {serverError && (
            <div role="alert" className="alert alert-error text-sm">
              {String(serverError)}
            </div>
          )}
          {saved && (
            <div role="status" className="alert alert-success text-sm">
              Profile saved.
            </div>
          )}

          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>

      {/* Live preview */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-sm font-medium text-base-content/60">Preview</p>
        <div className="card bg-base-100 shadow-sm">
          <figure className="aspect-square w-full overflow-hidden bg-base-200">
            <img
              src={form.profileUrl && !errors.profileUrl ? form.profileUrl : DEFAULT_AVATAR}
              alt={`${previewName} profile`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = DEFAULT_AVATAR
              }}
            />
          </figure>
          <div className="card-body gap-2 p-5">
            <h3 className="card-title">
              {previewName}
              {form.age && <span className="font-normal text-base-content/60">{form.age}</span>}
            </h3>
            {form.gender && <p className="text-sm text-base-content/60">{form.gender}</p>}
            <p className="text-sm">{form.about || 'Your bio will show up here.'}</p>
            {skills.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="badge badge-outline">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default EditProfile