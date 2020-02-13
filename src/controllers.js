const types = require('./types')

class Controllers {
  constructor(db) {
    this.profile = db.profile

    this.getKYC = this.getKYC.bind(this)
  }

  init() {
  }

  async saveKYC(payload) {
    try {
      if(payload.status === '1stStep') {
        payload = await types.kycStep1.validateSync(payload, {
          abortEarly: false,
          stripUnknown: true
        })
      }
      else if(payload.status === '2ndStep') {
        payload = await types.kycStep2.validateSync(payload, {
          abortEarly: false,
          stripUnknown: true
        })
      }
      else if(payload.status === '3rdStep') {
        payload = await types.kycStep3.validateSync(payload, {
          abortEarly: false,
          stripUnknown: true
        })
        const currentKYC = await this.getKYC(payload)
        if(!currentKYC.data || currentKYC.data && currentKYC.data.status !== '2ndStep') {
          throw ({
            message: `invalid kyc status`
          })
        }
      }
      else {
        throw ({
          message: 'invalid kyc status'
        })
      }

      await this.profile.collection('kyc').findOneAndUpdate({
        userUid: payload.userUid
      }, {
        $set: payload
      }, {
        upsert: true
      })
      return {
        status: 'success',
        data: {
          userUid: payload.userUid
        }
      }
    } catch (err) {
			return {
				status: 'error',
        message: err.message || 'please try again',
        errors: err.errors || []
			}	
    }
  }

  async getKYC(payload) {
    const user = await this.profile.collection('kyc').findOne({
      userUid: payload.userUid
    })
    return {
      status: 'success',
      data: user
    }
  }
}

module.exports = Controllers